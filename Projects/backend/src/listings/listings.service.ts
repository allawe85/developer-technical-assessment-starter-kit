import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  // Fetch Popular Listings (Hits the SQL View)
  async getPopular() {
    // We use $queryRaw because "popular_listings_view" is a SQL View, not a physical table 
    // mapped in schema.prisma.
    const results = await (this.prisma as any).$queryRaw`
      SELECT * FROM popular_listings_view 
      ORDER BY popularity_score DESC, created_at DESC 
      LIMIT 6
    `;
    
    // Parse the image_urls (Postgres returns them as a string like "{url1,url2}" in raw queries)
    return this.formatRawResults(results);
  }
    // NEW: Map Listings (Top 50 with Coordinates)
  async getMapListings() {
    const results = await (this.prisma as any).$queryRaw`
      SELECT * FROM popular_listings_view 
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      ORDER BY popularity_score DESC, created_at DESC 
      LIMIT 50
    `;
    return this.formatRawResults(results);
  }

  // Uses the Full-Text Search Index (GIN) we created
  async search(keyword: string) {
    // If keyword is empty, return popular
    if (!keyword) return this.getPopular();

    // Sanitize input for tsquery
    const term = keyword.trim().split(/\s+/).join(' & ');

    // Parallel queries to all 3 tables using the indexed 'search_vector'
    const [props, projects, lands] = await Promise.all([
        (this.prisma as any).$queryRaw`SELECT id, name, price, location, image_urls, 'property' as type FROM properties WHERE search_vector @@ to_tsquery('english', ${term}) LIMIT 5`,
        (this.prisma as any).$queryRaw`SELECT id, name, price_range, location, image_urls, 'project' as type FROM projects WHERE search_vector @@ to_tsquery('english', ${term}) LIMIT 5`,
        (this.prisma as any).$queryRaw`SELECT id, name, price, location, image_urls, 'land' as type FROM lands WHERE search_vector @@ to_tsquery('english', ${term}) LIMIT 5`
    ]);

    const combined = [...(props as any[]), ...(projects as any[]), ...(lands as any[])];
    return this.formatRawResults(combined);
  }

  // 3. Get Details (Single Item)
  async findOne(type: string, id: string) {
    let item;
    
    // Switch based on type to query the correct table
    switch (type.toLowerCase()) {
      case 'property':
        item = await (this.prisma as any).properties.findUnique({ where: { id } });
        break;
      case 'project':
        item = await (this.prisma as any).projects.findUnique({ where: { id } });
        break;
      case 'land':
        item = await (this.prisma as any).lands.findUnique({ where: { id } });
        break;
      default:
        throw new NotFoundException('Invalid listing type');
    }

    if (!item) throw new NotFoundException('Listing not found');
    return item;
  }

  // Helper to clean up Raw SQL array formatting (Postgres arrays come back as string "{a,b}")
  private formatRawResults(results: any) {
    if (!Array.isArray(results)) return [];
    return results.map((row: any) => {

        // Handle BigInt serialization if necessary (Prisma returns Decimals/BigInts weirdly sometimes)
        return {
            ...row,
            // FIX: Convert BigInt popularity_score to a standard number
            popularity_score: row.popularity_score ? Number(row.popularity_score) : 0, 
            price: row.price ? row.price.toString() : row.price_range, 
            image_urls: Array.isArray(row.image_urls) ? row.image_urls : this.parsePostgresArray(row.image_urls),
            latitude: row.latitude ? Number(row.latitude) : null,
            longitude: row.longitude ? Number(row.longitude) : null
        };
    });
  }

  private parsePostgresArray(arrStr: string | string[]) {
      if (Array.isArray(arrStr)) return arrStr;
      if (!arrStr) return [];
      // Clean string "{url1,url2}" -> ["url1", "url2"]
      return arrStr.replace(/^{|}$/g, '').split(',');
  }
}