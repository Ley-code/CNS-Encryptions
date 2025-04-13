import { Module } from '@nestjs/common';
import { EncryptionModule } from './encryption/encryption.module';

@Module({
  imports: [EncryptionModule],
})
export class AppModule {}
// This is the main module of the application. It imports the EncryptionModule, which contains the encryption-related functionality. The AppModule serves as the root module for the NestJS application.
