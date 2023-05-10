import { readFile } from 'node:fs/promises';

import { rootPath } from './root-path.js';

const pkgJson = await readFile(rootPath('package.json'));

interface PackageJson {
  title: string;
  version: string;
  homepage: string;
}

export const { title, version, homepage } = JSON.parse(pkgJson.toString()) as PackageJson;
