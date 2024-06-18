import { readFile as readFileAsync } from 'fs/promises';

import { DcxError } from '../error.js';

export async function readFileToString(filepath: string) {
  try {
    const data = await readFileAsync(filepath);
    if (!data) {
      throw new DcxError(`No data in file ${filepath}`);
    }
    console.log(`Loaded data from ${filepath}`, data);
    return data.toString();
  } catch (error) {
    console.error("failed to readFileToString", error);
  }
}

export async function readFileToJSON(filepath: string) {
  try {
    const data = await readFileToString(filepath);
    if (!data) {
      throw new DcxError(`No data in file ${filepath}`);
    }
    console.log(`Loaded data from ${filepath}`, data);
    return JSON.parse(data);
  } catch (error: any) {
    console.error("failed to readFileToJSON", error);
  }
}