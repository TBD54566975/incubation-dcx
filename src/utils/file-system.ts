import { readFile, access, constants, writeFile } from 'fs/promises';
import { DcxServerError } from './error.js';
import { parse } from './json.js';

export class FileSystem {
  public static async toJson(data: string): Promise<any> {
    try {
      return parse(data);
    } catch (error: any) {
      console.error(`${this.name}: failed to parse ${data} toJson`, error);
      throw new Error(error) as DcxServerError;
    }
  }

  public static async exists(path: string): Promise<boolean> {
    try {
      await access(path, constants.F_OK);
      return true;
    } catch (error: any) {
      console.error(`${this.name}: ${path} does not exist`, error);
      return false;
    }
  }

  public static async read(path: string): Promise<Buffer> {
    try {
      return await readFile(path);
    } catch (error: any) {
      console.error('failed to read', error);
      throw new Error(error) as DcxServerError;
    }
  }

  public static async readToString(path: string): Promise<string> {
    try {
      const data = await FileSystem.read(path);
      return data.toString();
    } catch (error: any) {
      console.error('failed to read', error);
      throw new Error(error) as DcxServerError;
    }
  }

  public static async readToJson(path: string): Promise<any> {
    try {
      const data = await FileSystem.readToString(path);
      return FileSystem.toJson(data);
    } catch (error: any) {
      console.error('failed to read', error);
      throw new Error(error) as DcxServerError;
    }
  }

  public static async create(path: string, data: string): Promise<boolean> {
    try {
      await writeFile(path, data, 'utf8');
      return true;
    } catch (error: any) {
      console.error('failed to readTxt', error);
      throw new Error(error) as DcxServerError;
    }
  }
}
