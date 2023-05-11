import { NodeEnv } from './node-env.enum.js';

export interface Config {
  nodeEnv: NodeEnv;
  isProduction: boolean;
  isDevelopment: boolean;
  baseURL: string;
  hostname: string;
  port: number;
  isHTTPS: boolean;
  githubBaseURL: string;
  githubApiURL: string;
  githubAppID: string;
  githubAppSecret: string;
  isGHE: boolean;
  cookieTTL: number | null;
  cryptoKey: string;
  cryptoIV: string;
}
