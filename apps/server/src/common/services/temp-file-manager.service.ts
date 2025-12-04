import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

export class TempFileManager {
  private static readonly tempDir = os.tmpdir();

  private static readonly storage = new AsyncLocalStorage<{
    id: string;
    tempFilePaths: Set<string>;
  }>();

  static getPath(filePath: string): string {
    const store = this.storage.getStore();

    if (!store) {
      throw new Error('TempFileManager is not initialized');
    }

    const tempFilePath = path.join(this.tempDir, `${store.id}_${filePath}`);
    store.tempFilePaths.add(tempFilePath);

    return tempFilePath;
  }

  static async exists(filePath: string): Promise<boolean> {
    const tempFilePath = this.getPath(filePath);

    try {
      await fsPromises.access(tempFilePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  static async readFile(filePath: string): Promise<Buffer> {
    const tempFilePath = this.getPath(filePath);
    return await fsPromises.readFile(tempFilePath);
  }

  static async writeFile(filePath: string, buffer: Buffer): Promise<void> {
    const tempFilePath = this.getPath(filePath);
    await fsPromises.writeFile(tempFilePath, buffer);
  }

  static async run<T>(callback: () => Promise<T>): Promise<T> {
    const id = randomUUID();
    const tempFilePaths = new Set<string>();

    try {
      return await this.storage.run({ id, tempFilePaths }, callback);
    } finally {
      for (const tempFilePath of tempFilePaths) {
        try {
          await fsPromises.unlink(tempFilePath);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          //
        }
      }
    }
  }
}
