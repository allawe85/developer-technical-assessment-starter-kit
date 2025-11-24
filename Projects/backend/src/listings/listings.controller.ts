import { Controller, Get, Query, Param } from '@nestjs/common';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  // Endpoint: GET /listings/popular
  @Get('popular')
  getPopular() {
    return this.listingsService.getPopular();
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