import { expect } from 'chai';
import { FileSystem } from '../src/index.js';

describe('FileSystem class', () => {
  describe('access()', () => {
    it('should try to access a file locally', async ()  =>{
      const access = await FileSystem.access('');
      expect(access).to.be.undefined;
    });
  });

  describe('exists()', () => {
    it('should determine if a file exists locally', async ()  => {
      const exists = await FileSystem.exists('');
      expect(exists).to.be.false;
    });
  });

  describe('read()', () => {
    it('should read the contents of a file locally', async ()  => {
      await FileSystem.read('');
    });
  });

  describe('readToString()', () => {
    it('should read the contents of a file locally and return it as a string', async ()  => {
      await FileSystem.readToString('');
    });
  });

  describe('readToJson()', () => {
    it('should read the contents of a file locally and return it as a json object', async ()  => {
      await FileSystem.readToJson('');
    });
  });

  describe('touch()', () => {
    it('should create a new file', async ()  => {
      await FileSystem.touch('');
    });
  });

  describe('write()', () => {
    it('should write data to a file', async ()  => {
      await FileSystem.write('', '');
    });
  });

  describe('append()', () => {
    it('should append data to a file', async ()  => {
      await FileSystem.append('', '');
    });
  });

  describe('overwrite()', () => {
    it('should overwrite the contents of a file', async ()  => {
      await FileSystem.overwrite('', '');
    });
  });
});