/* eslint-disable no-undef */
import crypto from 'crypto';
import { Readable } from '@web5/common';

export enum CipherAlgorightm {
  AES_256_CBC = 'aes-256-cbc',
  AES_256_CTR = 'aes-256-ctr',
}

export class StreamCipher {
  algorithm: CipherAlgorightm;
  constructor(algorithm: CipherAlgorightm) {
    this.algorithm = algorithm;
  }

  /**
   * Encrypts the given plaintext stream using the specified algorithm
   * @param key the encryption key
   * @param initVector the initialization vector
   * @param plaintextStream the plaintext stream to encrypt
   * @returns the encrypted stream
   */
  public async encryptStream(
    key: Buffer,
    initVector: Buffer,
    plaintextStream: Readable,
  ): Promise<Readable> {
    switch (this.algorithm) {
      case CipherAlgorightm.AES_256_CBC:
        return await StreamCipher.aes256CbcEncryptStream(key, initVector, plaintextStream);
      case CipherAlgorightm.AES_256_CTR:
        return await StreamCipher.aes256CtrEncryptStream(key, initVector, plaintextStream);
      default:
        throw new Error('Algorithm not supported');
    }
  }

  /**
   * Decrypts the given cipher stream using the specified algorithm
   * @param key the encryption key
   * @param initVector the initialization vector
   * @param cipherStream the cipher stream to decrypt
   * @returns the decrypted stream
   */
  public async decryptStream(
    key: Buffer,
    initVector: Buffer,
    cipherStream: Readable,
  ): Promise<Readable> {
    switch (this.algorithm) {
      case CipherAlgorightm.AES_256_CBC:
        return StreamCipher.aes256CbcDecryptStream(key, initVector, cipherStream);
      case CipherAlgorightm.AES_256_CTR:
        return StreamCipher.aes256CtrDecryptStream(key, initVector, cipherStream);
      default:
        throw new Error('Algorithm unset or not supported');
    }
  }

  /**
   * aes-256-cbc
   * key size: 256 bits (32 bytes)
   * iv size: 128 bits (16 bytes)
   */

  /**
   * Encrypts the given plaintext stream using aes-256-cbc algorithm.
   * @param key the encryption key
   * @param initVector the initialization vector
   * @param plaintextStream the plaintext stream to encrypt
   * @returns the encrypted stream
   */
  public static async aes256CbcEncryptStream(
    key: Buffer,
    initVector: Buffer,
    plaintextStream: Readable,
  ): Promise<Readable> {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, initVector);

    const cipherStream = new Readable({
      read(): void {},
    });

    plaintextStream.on('data', (chunk: crypto.BinaryLike) => {
      const encryptedChunk = cipher.update(chunk);
      cipherStream.push(encryptedChunk);
    });

    plaintextStream.on('end', () => {
      const finalChunk = cipher.final();
      cipherStream.push(finalChunk);
      cipherStream.push(null);
    });

    plaintextStream.on('error', (err: any) => {
      cipherStream.emit('error', err);
    });

    return cipherStream;
  }

  /**
   * Decrypts the given cipher stream using aes-256-cbc algorithm.
   * @param key the encryption key
   * @param initVector the initialization vector
   * @param cipherStream the cipher stream to decrypt
   * @returns the decrypted stream
   */
  public static async aes256CbcDecryptStream(
    key: Buffer,
    initVector: Buffer,
    cipherStream: Readable,
  ): Promise<Readable> {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, initVector);

    const plaintextStream = new Readable({
      read(): void {},
    });

    cipherStream.on('data', (chunk: NodeJS.ArrayBufferView) => {
      const decryptedChunk = decipher.update(chunk);
      plaintextStream.push(decryptedChunk);
    });

    cipherStream.on('end', () => {
      const finalChunk = decipher.final();
      plaintextStream.push(finalChunk);
      plaintextStream.push(null);
    });

    cipherStream.on('error', (err: any) => {
      plaintextStream.emit('error', err);
    });

    return plaintextStream;
  }

  /**
   * aes-256-ctr
   * key: 256 bits (32 bytes)
   * iv: 128 bits (16 bytes)
   */

  /**
   * Encrypts the given plaintext stream using aes-256-ctr algorithm.
   * @param key the encryption key
   * @param initVector the initialization vector
   * @param plaintextStream the plaintext stream to encrypt
   * @returns the encrypted stream
   */
  public static async aes256CtrEncryptStream(
    key: Buffer,
    initVector: Buffer,
    plaintextStream: Readable,
  ): Promise<Readable> {
    const cipher = crypto.createCipheriv('aes-256-ctr', key, initVector);

    const cipherStream = new Readable({
      read(): void {},
    });

    plaintextStream.on('data', (chunk: crypto.BinaryLike) => {
      const encryptedChunk = cipher.update(chunk);
      cipherStream.push(encryptedChunk);
    });

    plaintextStream.on('end', () => {
      const finalChunk = cipher.final();
      cipherStream.push(finalChunk);
      cipherStream.push(null);
    });

    plaintextStream.on('error', (err: any) => {
      cipherStream.emit('error', err);
    });

    return cipherStream;
  }

  /**
   * Decrypts the given cipher stream using aes-256-ctr algorithm.
   * @param key the encryption key
   * @param initVector the initialization vector
   * @param cipherStream the cipher stream to decrypt
   * @returns the decrypted stream
   */
  public static async aes256CtrDecryptStream(
    key: Buffer,
    initVector: Buffer,
    cipherStream: Readable,
  ): Promise<Readable> {
    const decipher = crypto.createDecipheriv('aes-256-ctr', key, initVector);

    const plaintextStream = new Readable({
      read(): void {},
    });

    cipherStream.on('data', (chunk: NodeJS.ArrayBufferView) => {
      const decryptedChunk = decipher.update(chunk);
      plaintextStream.push(decryptedChunk);
    });

    cipherStream.on('end', () => {
      const finalChunk = decipher.final();
      plaintextStream.push(finalChunk);
      plaintextStream.push(null);
    });

    cipherStream.on('error', (err: any) => {
      plaintextStream.emit('error', err);
    });

    return plaintextStream;
  }
}

export class Cipher extends StreamCipher {
  constructor(algorithm: CipherAlgorightm) {
    super(algorithm);
  }

  /**
   * Encrypts the given plaintext message using the specified algorithm
   * @param key the encryption key
   * @param initVector the initialization vector
   * @param plaintext the plaintext message to encrypt
   * @returns the encrypted message in base64 format using the specified algorithm
   */
  public async encrypt(key: Buffer, initVector: Buffer, plaintext: string): Promise<string> {
    switch (this.algorithm) {
      case CipherAlgorightm.AES_256_CBC:
        return Cipher.aes256CbcEncrypt(key, initVector, plaintext);
      case CipherAlgorightm.AES_256_CTR:
        return Cipher.aes256CtrEncrypt(key, initVector, plaintext);
      default:
        throw new Error('Algorithm not set or unsupported');
    }
  }

  /**
   * Decrypts the given ciphertext message using the specified algorithm
   * @param key the encryption key
   * @param initVector the initialization vector
   * @param ciphertext the encrypted message in base64 format
   * @returns the decrypted message in utf-8 format using the specified algorithm
   */
  public async decrypt(key: Buffer, initVector: Buffer, ciphertext: string): Promise<string> {
    switch (this.algorithm) {
      case CipherAlgorightm.AES_256_CBC:
        return Cipher.aes256CbcDecrypt(key, initVector, ciphertext);
      case CipherAlgorightm.AES_256_CTR:
        return Cipher.aes256CtrDecrypt(key, initVector, ciphertext);
      default:
        throw new Error('Algorithm not set or unsupported');
    }
  }

  // AES-256-CBC
  /**
   *
   * @param key the encryption key
   * @param plaintext the plaintext message
   * @param initVector the initialization vector
   * @returns the encrypted message in base64 format using aes-256-cbc algorithm
   */
  public static aes256CbcEncrypt(key: Buffer, initVector: Buffer, plaintext: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, initVector);
    let encryptedBuff = cipher.update(plaintext, 'utf8');
    encryptedBuff = Buffer.concat([encryptedBuff, cipher.final()]);
    return encryptedBuff.toString('base64');
  }

  /**
   *
   * @param key the encryption key
   * @param cipher the encrypted message
   * @param initVector the initialization vector
   * @returns the decrypted message in utf-8 format using aes-256-cbc algorithm
   */
  public static aes256CbcDecrypt(key: Buffer, initVector: Buffer, cipher: string): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, initVector);
    const decrypted = decipher.update(Buffer.from(cipher, 'base64'));
    return Buffer.concat([decrypted, decipher.final()]).toString('utf8');
  }

  // AES-256-CTR
  /**
   *
   * @param key the encryption key
   * @param plaintext the plaintext message
   * @param initVector the initialization vector
   * @returns the encrypted message in base64 format using aes-256-ctr algorithm
   */
  public static aes256CtrEncrypt(key: Buffer, initVector: Buffer, plaintext: string): string {
    const cipher = crypto.createCipheriv('aes-256-ctr', key, initVector);
    let encryptedBuff = cipher.update(plaintext, 'utf8');
    encryptedBuff = Buffer.concat([encryptedBuff, cipher.final()]);
    return encryptedBuff.toString('base64');
  }

  /**
   *
   * @param key the encryption key
   * @param cipher the encrypted message in format: initVector:cipher
   * @returns the decrypted message in utf-8 format using aes-256-ctr algorithm
   */
  public static aes256CtrDecrypt(key: Buffer, initVector: Buffer, cipher: string): string {
    const decipher = crypto.createDecipheriv('aes-256-ctr', key, initVector);
    const decrypted = decipher.update(Buffer.from(cipher, 'base64'));
    return Buffer.concat([decrypted, decipher.final()]).toString('utf8');
  }
}
