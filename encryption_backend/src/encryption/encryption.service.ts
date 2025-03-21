import { Injectable, BadRequestException } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptionService {
  processRequest(type: string, key: string, text: string, task: string) {
    switch (type) {
      case 'OTP':
        return this.handleOTP(text, key, task);
      case 'AES':
        return this.handleAES(text, key, task);
      case '3DES':
        return this.handle3DES(text, key, task);
      default:
        throw new BadRequestException('Invalid encryption type');
    }
  }

  // One-Time Pad (OTP) Encryption (Custom Implementation)
  private handleOTP(text: string, key: string, task: string) {
    
    if (task === "encrypt"){
      if (text.length !== key.length) {
        throw new BadRequestException(
          'For OTP, key length must be equal to text length',
        );
      }
    }
    const mytext = task === 'encrypt' ? text : Buffer.from(text, "hex").toString()
    let result = '';
    for (let i = 0; i < mytext.length; i++) {
      result += String.fromCharCode(
        mytext.charCodeAt(i) ^ key.charCodeAt(i),
      );  
    }
    
    return {
      result: task === 'encrypt' ? Buffer.from(result, 'utf8').toString('hex') : result,
    };
  }
  
  // AES Encryption/Decryption
  private handleAES(text: string, key: string, task: string) {
    if (task === 'encrypt') {
      return {
        result: CryptoJS.AES.encrypt(text, key).toString(),
      };
    } else {
      const bytes = CryptoJS.AES.decrypt(text, key);
      return {
        result: bytes.toString(CryptoJS.enc.Utf8),
      };
    }
  }

  // 3DES Encryption/Decryption
  private handle3DES(text: string, key: string, task: string) {
    if (task === 'encrypt') {
      return {
        result: CryptoJS.TripleDES.encrypt(text, key).toString(),
      };
    } else {
      const bytes = CryptoJS.TripleDES.decrypt(text, key);
      return {
        result: bytes.toString(CryptoJS.enc.Utf8),
      };
    }
  }
}
