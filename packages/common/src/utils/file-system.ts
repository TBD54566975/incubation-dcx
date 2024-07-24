import { access, constants, open, readFile } from 'fs/promises';
import { parse } from './json.js';
import { Logger } from './logger.js';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
export class FileSystem {
  public static async findFileInProject(fileName: string): Promise<string> {
    let currentDir: string;
    let found = false;
    let filePath = '';

    if (typeof require !== 'undefined' && typeof require.main !== 'undefined') {
      currentDir = require.main.path; // CommonJS
    } else {
      const __filename = fileURLToPath(import.meta.url); // ESM
      currentDir = dirname(__filename);
    }

    while (!found) {
      filePath = join(currentDir, fileName);
      try {
        await FileSystem.access(filePath);
        found = true;
      } catch {
        const parentDir = resolve(currentDir, '..');
        if (parentDir === currentDir) {
          throw new Error(`Could not find ${fileName} in the project root`);
        }
        currentDir = parentDir;
      }
    }

    return filePath;
  }

  public static async access(path: string): Promise<void> {
    try {
      await access(path, constants.R_OK | constants.W_OK);
      console.log('can access');
    } catch {
      console.error('cannot access');
    }
  }

  public static toJson(data: string): any {
    try {
      return parse(data);
    } catch (error: any) {
      Logger.error(`Failed to parse ${data} toJson`);
      return {};
    }
  }

  public static async exists(path: string): Promise<boolean> {
    try {
      await access(path, constants.F_OK);
      return true;
    } catch (error: any) {
      Logger.warn(`${path} does not exist`);
      return false;
    }
  }

  public static async read(path: string): Promise<Buffer | undefined> {
    try {
      const exists = await FileSystem.exists(path);
      return !exists ? undefined : await readFile(path);
    } catch (error: any) {
      Logger.warn(`Failed to read ${path}`);
      return undefined;
    }
  }

  public static async readToString(path: string): Promise<string> {
    try {
      const data = await FileSystem.read(path);
      if (!data) {
        const touched = await FileSystem.touch(path);
        Logger.info(`File ${path} touched ${touched}`);
      }
      return !data ? '' : data.toString();
    } catch (error: any) {
      Logger.warn(`Failed to read ${path} toString`);
      return '';
    }
  }

  public static async readToJson(path: string): Promise<any> {
    try {
      const data = await FileSystem.readToString(path);
      if (!data) {
        const touched = await FileSystem.touch(path, {});
        Logger.info(`File ${path} touched ${touched}`);
      }
      return !data ? {} : FileSystem.toJson(data);
    } catch (error: any) {
      Logger.warn(`Failed to read ${path} toJson`);
      return {};
    }
  }

  public static async touch(path: string, data: any = ''): Promise<boolean> {
    try {
      const file = await open(path, 'w', 0o700);
      await file.writeFile(data);
      await file.close();
      return true;
    } catch (error: any) {
      Logger.warn(`Failed to touch ${path}`);
      return false;
    }
  }

  public static async write(path: string, data: string): Promise<boolean> {
    try {
      const exists = await FileSystem.exists(path);
      if (!exists) {
        const file = await open(path, 'w', 0o700);
        await file.writeFile(data, 'utf-8');
        await file.close();
        return true;
      }
      return false;
    } catch (error: any) {
      Logger.error(`Failed to write ${path}`);
      return false;
    }
  }

  public static async append(path: string, data: string): Promise<boolean> {
    try {
      const exists = await FileSystem.exists(path);
      if (!exists) {
        const file = await open(path, 'a', 0o700);
        await file.appendFile(data, 'utf-8');
        await file.close();
        return true;
      }
      return false;
    } catch (error: any) {
      Logger.error(`Failed to append ${path}`);
      return false;
    }
  }

  public static async overwrite(path: string, data: string): Promise<boolean> {
    try {
      const file = await open(path, 'w', 0o700);
      await file.writeFile(data, 'utf-8');
      await file.close();
      return true;
    } catch (error: any) {
      Logger.error(`Failed to overwrite ${path}`);
      return false;
    }
  }
}
