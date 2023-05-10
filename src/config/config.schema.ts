import Joi from 'joi';

import { Config } from './config.interface.js';

export const configSchema = Joi.object<Config>({
  nodeEnv: Joi.string().valid('development', 'production').required(),
  isProduction: Joi.boolean().required(),
  isDevelopment: Joi.boolean().required(),
  baseURL: Joi.string()
    .uri({ scheme: ['https', 'http'] })
    .required(),
  hostname: Joi.string().hostname().required(),
  port: Joi.number().required(),
  isHTTPS: Joi.boolean().required(),
  githubBaseURL: Joi.string().uri({ scheme: 'https' }).required(),
  githubApiURL: Joi.string().uri({ scheme: 'https' }).required(),
  githubAppID: Joi.string().token().required(),
  githubAppSecret: Joi.string().token().required(),
  isGHE: Joi.boolean().required(),
  cryptoKey: Joi.string().min(128).required(),
  cryptoIV: Joi.string().min(128).required()
});
