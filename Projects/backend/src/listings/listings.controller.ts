import { Controller, Get, Query, Param, UseInterceptors } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager'; 

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  // Endpoint: GET /listings/popular
  @UseInterceptors(CacheInterceptor) 
  @CacheTTL(60000) 
  @Get('popular')
  getPopular() {
    return this.listingsService.getPopular();
  }

  // ENDPOINT: GET /listings/map
  @Get('map')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000)
  getMapListings() {
    return this.listingsService.getMapListings();
  }

  // Endpoint: GET /listings/search?q=villa
  @Get('search')
  search(@Query('q') q: string) {
    return this.listingsService.search(q);
  }

  // Endpoint: GET /listings/property/:id
  @Get(':type/:id')
  findOne(@Param('type') type: string, @Param('id') id: string) {
    return this.listingsService.findOne(type, id);
  }
}