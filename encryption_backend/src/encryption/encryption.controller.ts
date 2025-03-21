import { Controller, Post, Body } from '@nestjs/common';
import { EncryptionService } from './encryption.service';

@Controller('encryption')
export class EncryptionController {
  constructor(private readonly encryptionService: EncryptionService) {}

  @Post()
  handleEncryption(@Body() body: any) {
    const { type_of_encryption, decryption_key, text, task } = body;
    console.log(type_of_encryption)
    return this.encryptionService.processRequest(
      type_of_encryption,
      decryption_key,
      text,
      task,
    );
  }
}
