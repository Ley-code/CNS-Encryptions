import { Injectable, BadRequestException } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import * as forge from 'node-forge';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EncryptionService {
  private publicKey: forge.pki.PublicKey;
  private privateKey: forge.pki.PrivateKey;

  constructor() {
    this.loadKeys();
  }
  private loadKeys() {
    try {
      // Use process.cwd() to get the root directory of the project
      const basePath = path.join(process.cwd(), 'src/keys');
      const publicKeyPem = fs.readFileSync(path.join(basePath, 'public_key.pem'), 'utf8');
      const privateKeyPem = fs.readFileSync(path.join(basePath, 'private_key.pem'), 'utf8');

      // Convert PEM strings to key objects
      this.publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
      this.privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    } catch (error) {
      console.error('Error loading RSA keys:', error);
      throw new Error('Failed to load RSA keys');
    }
  }

  processRequest(type: string, key: string, text: string, task: string) {
    switch (type) {
      case 'RSA':
        return this.handleRSA(text, task);
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
  encryptRSA(text: string): string {
    try {
      const encrypted = this.publicKey.encrypt(forge.util.encodeUtf8(text), 'RSA-OAEP');
      return forge.util.encode64(encrypted);
    } catch (error) {
      throw new BadRequestException('RSA Encryption failed');
    }
  }

  decryptRSA(encryptedText: string): string {
    try {
      const decrypted = this.privateKey.decrypt(forge.util.decode64(encryptedText), 'RSA-OAEP');
      return forge.util.decodeUtf8(decrypted);
    } catch (error) {
      throw new BadRequestException('RSA Decryption failed');
    }
  }
  private handleRSA(text: string, task: string) {

    if (task === 'encrypt') {
      const encrypted = this.encryptRSA(text);
      return { result: encrypted };
    } else {
      const decrypted = this.decryptRSA(text);
      return { result: decrypted };
    }
  }

  // One-Time Pad (OTP) Encryption (Custom Implementation)
  private handleOTP(text: string, key: string, task: string) {

    if (task === "encrypt") {
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
