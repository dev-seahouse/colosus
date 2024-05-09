import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';

export enum CacheStore {
  MEMORY = 'memory',
  REDIS = 'redis',
}

export interface INestCacheConfigInternalDto {
  cacheStore: CacheStore;
  redisHost: string | null;
  redisPort: number | null;
  redisPassword: string | null;
}

export interface INestCacheConfigDto {
  nestCacheConfig: INestCacheConfigInternalDto;
}

export const getNestCacheConfiguration = (): INestCacheConfigDto => {
  const result: INestCacheConfigDto = {
    nestCacheConfig: {
      cacheStore: EnvironmentVariables.getEnvVariableAsString({
        fieldName: 'NESTJS_CACHE_STORE',
        defaultValue: CacheStore.MEMORY,
        allowedValues: Object.values(CacheStore),
      }) as CacheStore,
      redisHost: null,
      redisPort: null,
      redisPassword: null,
    },
  };

  if (result.nestCacheConfig.cacheStore === CacheStore.REDIS) {
    result.nestCacheConfig.redisHost =
      EnvironmentVariables.getEnvVariableAsString({
        fieldName: 'NESTJS_CACHE_REDIS_HOST',
      });
    result.nestCacheConfig.redisPort =
      EnvironmentVariables.getEnvVariableAsInteger({
        fieldName: 'NESTJS_CACHE_REDIS_PORT',
      });
    result.nestCacheConfig.redisPassword =
      EnvironmentVariables.getEnvVariableAsString({
        fieldName: 'NESTJS_CACHE_REDIS_PASSWORD',
      });
  }

  return result;
};
