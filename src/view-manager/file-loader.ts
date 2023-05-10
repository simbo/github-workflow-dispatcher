import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { minifyHTML } from './html-minifier.js';

interface File {
  src: string;
  path: string;
  noCache: boolean;
}

/**
 * The FileLoader loads files, that are required within a template.
 *
 * It does not load templates!
 * Templates are loaded by the hapi view manager and their content is passed to the compile function.
 */
export class FileLoader {
  public readonly async = true;

  constructor(private readonly sourcePath: string, private readonly options: { [key: string]: any }) {}

  public getSource(name: string, callback: (error?: Error, file?: File) => void): void {
    const path = join(this.sourcePath, name);
    const noCache = !!this.options.noCache;
    readFile(path)
      .then(contents => minifyHTML(contents.toString()))
      .then(src => callback(undefined, { src, path, noCache }))
      .catch(callback);
  }
}
