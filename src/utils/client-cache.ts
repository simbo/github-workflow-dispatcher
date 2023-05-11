import millisecond from 'millisecond';

interface CacheOptions {
  expiresIn?: number;
  privacy: 'private';
}

/**
 * Default settings for client-side caching
 */
export function clientCache(expiresIn?: string): CacheOptions {
  const cacheOptions: CacheOptions = {
    privacy: 'private'
  };

  if (expiresIn) {
    cacheOptions.expiresIn = millisecond(expiresIn);
  }

  return cacheOptions;
}
