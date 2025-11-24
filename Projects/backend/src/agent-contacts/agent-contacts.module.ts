import { Module } from '@nestjs/common';
import { AgentContactsService } from './agent-contacts.service';
import { AgentContactsController } from './agent-contacts.controller';
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  imports: [PrismaModule], 
  controllers: [AgentContactsController],
  providers: [AgentContactsService],
})
export class AgentContactsModule {}
