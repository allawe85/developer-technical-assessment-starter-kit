import { Module } from '@nestjs/common';
import { AgentContactsService } from './agent-contacts.service';
import { AgentContactsController } from './agent-contacts.controller';

@Module({
  controllers: [AgentContactsController],
  providers: [AgentContactsService],
})
export class AgentContactsModule {}
