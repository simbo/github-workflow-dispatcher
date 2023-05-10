import crypto from 'node:crypto';

import { cryptoIV, cryptoKey } from '../config/config.js';

const algorithm = 'aes-256-cbc';

// generate hashes with required length from key and init vector from config
const key = crypto.createHash('sha512').update(cryptoKey).digest('hex').slice(0, 32);
const iv = crypto.createHash('sha512').update(cryptoIV).digest('hex').slice(0, 16);

/**
 * JSON encode and encrypt
 */
export function encrypt<T = any>(data: T): string {
  const strinifiedData = JSON.stringify(data);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  return cipher.update(strinifiedData, 'utf8', 'hex') + cipher.final('hex');
}

/**
 * Decrypt and JSON decode
 */
export function decrypt<T = any>(encrypted: string): T {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
  return JSON.parse(decrypted);
}
