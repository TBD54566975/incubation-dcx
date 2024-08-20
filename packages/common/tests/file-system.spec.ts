import { expect } from 'chai';
import { FileSystem } from '../src/index.js';
import crypto from 'crypto';

describe('FileSystem class', () => {
  const EXISTS_FILE_PATH = 'exists.txt';
  const DNE_FILE_PATH = 'dne.txt';
  const LAST_RECORD_ID = 'lastRecordId';
  const CURSOR = 'cursor.json';
  const randomUUID = crypto.randomUUID();

  afterEach(async () => {
    await FileSystem.rm(EXISTS_FILE_PATH);
    await FileSystem.rm(DNE_FILE_PATH);
    await FileSystem.rm(LAST_RECORD_ID);
    await FileSystem.rm(CURSOR);
  });

  describe('.touch()', () => {
    it(`should create a new file called ${EXISTS_FILE_PATH} and return true`, async ()  => {
      const touched = await FileSystem.touch(EXISTS_FILE_PATH, 'Hello, World!');
      expect(touched).to.be.true;
    });
  });

  describe('.access()', () => {
    it('should try to access a file', async ()  =>{
      const dne = await FileSystem.access(DNE_FILE_PATH);
      expect(dne).to.be.false;
      const exists = await FileSystem.access(EXISTS_FILE_PATH);
      expect(exists).to.be.true;
    });
  });

  describe('.exists()', () => {
    let exists;

    it('should return false for files that do not exist', async ()  => {
      exists = await FileSystem.exists(DNE_FILE_PATH);
      expect(exists).to.be.false;
    });

    it('should return true for files that exist', async ()  => {
      exists = await FileSystem.exists(EXISTS_FILE_PATH);
      expect(exists).to.be.true;
    });
  });

  describe('.read()', () => {
    let read;

    it('should return undefined for files that do not exist', async ()  => {
      read = await FileSystem.read(DNE_FILE_PATH);
      expect(read).to.be.undefined;
    });

    it('should return the contents of a file that exists', async ()  => {
      read = await FileSystem.read(EXISTS_FILE_PATH);
      expect(read).to.not.be.undefined;

      expect(read).to.be.instanceof(Buffer);
      expect(read!.toString()).to.contain('Hello, World!');
    });
  });

  describe('.write()', () => {

    it('should write data to a file', async ()  => {
      const write = await FileSystem.write(LAST_RECORD_ID, randomUUID);
      expect(write).to.be.true;
    });

    it('should not over write data to the same file', async ()  => {
      const write = await FileSystem.write(LAST_RECORD_ID, randomUUID);
      expect(write).to.be.false;
    });
  });

  describe('.readToString()', () => {
    let readToString;

    it('should create the file if it does not exist and return undefined', async ()  => {
      readToString = await FileSystem.readToString(LAST_RECORD_ID);
      expect(readToString).to.equal(randomUUID);
      const exists = await FileSystem.exists(LAST_RECORD_ID);
      expect(exists).to.be.true;
    });

    it('should return the contents of a file that exists', async ()  => {
      readToString = await FileSystem.readToString(LAST_RECORD_ID);
      expect(readToString).to.equal(randomUUID);
    });
  });

  describe('.readToJson()', () => {
    let readToJson;

    it('should create the file if it does not exist and return {}', async ()  => {
      readToJson = await FileSystem.readToJson(CURSOR);
      expect(readToJson).to.be.instanceof(Object);
      const exists = await FileSystem.exists(CURSOR);
      expect(exists).to.be.true;
    });

    it('should return the contents of a file that exists', async ()  => {
      readToJson = await FileSystem.readToJson(CURSOR);
      expect(readToJson).to.be.instanceof(Object);
    });
  });

  describe('.append()', () => {
    const newUUID = crypto.randomUUID();

    it('should append data to a file', async ()  => {
      const append = await FileSystem.append(LAST_RECORD_ID, newUUID);
      expect(append).to.be.true;
    });
  });

  describe('.overwrite()', () => {
    it('should overwrite the contents of a file', async ()  => {
      const overwrite = await FileSystem.overwrite(LAST_RECORD_ID, 'Hello, World!');
      expect(overwrite).to.be.true;
      const read = await FileSystem.read(LAST_RECORD_ID);
      expect(read!.toString()).to.contain('Hello, World!');
    });
  });
});