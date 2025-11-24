import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ListingsModule } from './listings/listings.module';
import { AgentContactsModule } from './agent-contacts/agent-contacts.module';

@Module({
  imports: [
    // 1. Load Environment Variables (e.g., JWT_SECRET, DATABASE_URL)
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    // 2. Register Your Feature Modules
    PrismaModule,
    AuthModule,
    ListingsModule,
    AgentContactsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}