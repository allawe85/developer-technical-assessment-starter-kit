import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager'; 
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ListingsModule } from './listings/listings.module';
import { AgentContactsModule } from './agent-contacts/agent-contacts.module';

@Module({
  imports: [
    // Load Environment Variables
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

     // Configure Global Cache
    CacheModule.register({
      isGlobal: true, 
      ttl: 60000, // Cache expires after 60 seconds (1 minute)
      max: 100,   // Max 100 items in memory
    }),

    // Register Feature Modules
    PrismaModule,
    AuthModule,
    ListingsModule,
    AgentContactsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}