import { env } from 'node:process';

import { config as parseEnvData } from 'dotenv';
import millisecond from 'millisecond';

import { rootPath } from '../utils/root-path.js';

import { Config } from './config.interface.js';
import { configSchema } from './config.schema.js';
import { NodeEnv } from './node-env.enum.js';

export const nodeEnv = (env.NODE_ENV as NodeEnv) || NodeEnv.Production;

parseEnvData({ path: rootPath(`.env-${nodeEnv}`) });

export const baseURL = env.BASE_URL || '';

export const githubBaseURL = env.GITHUB_BASE_URL || '';
export const githubApiURL = env.GITHUB_API_URL || '';

const githubHostnameRegex = /(\/|\.)github\.com$/;

const ttl = millisecond(env.COOKIE_TTL || '');
export const cookieTTL = ttl > 0 ? ttl : null; // eslint-disable-line unicorn/no-null

const cfg: Config = {
  nodeEnv,
  isDevelopment: nodeEnv === NodeEnv.Development,
  isProduction: nodeEnv === NodeEnv.Production,
  baseURL,
  hostname: env.HOSTNAME || '',
  port: Number.parseInt(env.PORT || '3000', 10),
  isHTTPS: baseURL.startsWith('https:'),
  githubBaseURL,
  githubApiURL,
  githubAppID: env.GITHUB_APP_CLIENT_ID || '',
  githubAppSecret: env.GITHUB_APP_CLIENT_SECRET || '',
  isGHE: !(
    githubHostnameRegex.test(new URL(githubBaseURL).hostname) ||
    githubHostnameRegex.test(new URL(githubApiURL).hostname)
  ),
  cookieTTL,
  cryptoKey: env.CRYPTO_KEY || '',
  cryptoIV: env.CRYPTO_IV || ''
};

const { error, value } = configSchema.validate(cfg);

if (error) {
  throw new Error(error.message);
}

export const {
  isDevelopment,
  isProduction,
  hostname,
  port,
  isHTTPS,
  githubAppID,
  githubAppSecret,
  isGHE,
  cryptoKey,
  cryptoIV
} = value;
