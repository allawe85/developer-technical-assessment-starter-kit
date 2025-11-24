import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable Validation (Vital for the Agent Contact DTOs we built)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips out unwanted properties from the body
    forbidNonWhitelisted: true, // Throws error if user sends extra fields
    transform: true, // Automatically transforms payloads to DTO instances
  }));

  // 2. Enable CORS (So your React Frontend can talk to this Backend)
  app.enableCors();

  // 3. Listen on Port 3000
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();