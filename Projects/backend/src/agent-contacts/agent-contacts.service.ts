import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class AgentContactsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateContactDto) {
    // We strictly use the userId from the token, not the body, for security.
    return this.prisma.agent_contacts.create({
      data: {
        user_id: userId,
        listing_id: dto.listingId,
        listing_type: dto.listingType,
        message: dto.message,
      },
    });
  }
}