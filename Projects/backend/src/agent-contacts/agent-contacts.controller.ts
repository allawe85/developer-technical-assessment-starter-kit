import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AgentContactsService } from './agent-contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('agent-contact') 
export class AgentContactsController {
  constructor(private readonly agentContactsService: AgentContactsService) {}

  @UseGuards(AuthGuard('jwt')) // The Security Wall
  @Post()
  create(
    @Req() req: Request & { user?: { userId: string } },
    @Body() createContactDto: CreateContactDto,
  ) {
    return this.agentContactsService.create(req.user!.userId, createContactDto);
  }
}