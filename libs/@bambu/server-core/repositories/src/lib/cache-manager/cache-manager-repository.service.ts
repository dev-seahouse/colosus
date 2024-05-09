import {
  BrokerageIntegrationServerDto,
  IServeInvestorPortalPageResponseDto,
} from '@bambu/server-core/dto';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { SharedEnums } from '@bambu/shared';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

export abstract class CacheManagerRepositoryServiceBase {
  public abstract Get(requestId: string, key: string): Promise<string | null>;

  public abstract GetInvestorProxyHtmlCache(
    requestId: string,
    originUrl: string
  ): Promise<IServeInvestorPortalPageResponseDto | null>;

  public abstract Set(
    requestId: string,
    key: string,
    value: string,
    ttl?: number
  ): Promise<void>;

  public abstract SetInvestorProxyHtmlCache(
    requestId: string,
    originUrl: string,
    data: IServeInvestorPortalPageResponseDto,
    ttl?: number
  ): Promise<void>;

  public abstract Delete(requestId: string, key: string): Promise<void>;

  public abstract DeleteInvestorProxyHtmlCache(
    requestId: string,
    originUrl: string
  ): Promise<void>;

  public abstract GetAuthenticationTokenFromCache(
    requestId: string,
    brokerage: SharedEnums.SupportedBrokerageIntegrationEnum,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto | null>;

  abstract SetAuthenticationTokenToCache(
    requestId: string,
    brokerage: SharedEnums.SupportedBrokerageIntegrationEnum,
    tenantId: string,
    ttl: number,
    payload: Record<string, unknown>
  ): Promise<void>;
}

@Injectable()
export class CacheManagerRepositoryService
  implements CacheManagerRepositoryServiceBase
{
  readonly #logger: Logger = new Logger(CacheManagerRepositoryService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async Get(requestId: string, key: string): Promise<string | null> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.Get.name,
      requestId
    );
    try {
      const value = await this.cacheManager.get<string>(key);
      this.#logger.debug(
        `${logPrefix} Result for cache key (${key}): ${value}.`
      );
      if (!value) {
        return null;
      }
      return value;
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Error while retrieving value for key (${key}).`,
        `Error details: ${JsonUtils.Stringify(error)}`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }

  public async GetInvestorProxyHtmlCache(
    requestId: string,
    originUrl: string
  ): Promise<IServeInvestorPortalPageResponseDto | null> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetInvestorProxyHtmlCache.name,
      requestId
    );
    const key: string = this.#computeInvestorIndexPageCacheKey(
      requestId,
      originUrl
    );
    const value: string | null = await this.Get(requestId, key);
    this.#logger.debug(
      `${logPrefix} Raw payload for (${originUrl})[${key}]: ${JsonUtils.Stringify(
        {
          value,
        }
      )}.`
    );

    if (value === null) {
      return null;
    }

    const data: IServeInvestorPortalPageResponseDto = JSON.parse(value);

    // JSON serialization causes the buffer object to look a little stupid.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.contentBody = Buffer.from((data.contentBody as any).data);

    return data;
  }

  #computeInvestorIndexPageCacheKey(
    requestId: string,
    originUrl: string
  ): string {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.#computeInvestorIndexPageCacheKey.name,
      requestId
    );

    const encodedUrl: string = Buffer.from(originUrl).toString('base64');
    const key = `INVESTOR_INDEX_PAGE_${encodedUrl}`;
    this.#logger.debug(
      `${logPrefix} Computed values: ${JsonUtils.Stringify({
        requestUrl: originUrl,
        encodedUrl,
        key,
      })}.`
    );

    return key;
  }

  public async Set(
    requestId: string,
    key: string,
    value: string,
    ttl?: number
  ): Promise<void> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.Set.name,
      requestId
    );
    const inputForLogging = {
      key,
      value,
      ttl,
    };
    this.#logger.debug(
      `${logPrefix} Input: ${JsonUtils.Stringify(inputForLogging)}.`
    );
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Error setting cache key ${key}.`,
        `Input: ${JsonUtils.Stringify(inputForLogging)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }

  public async SetInvestorProxyHtmlCache(
    requestId: string,
    originUrl: string,
    data: IServeInvestorPortalPageResponseDto,
    ttl?: number
  ) {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.SetInvestorProxyHtmlCache.name,
      requestId
    );
    const inputForLogging = {
      originUrl,
      data,
      ttl,
    };
    this.#logger.debug(
      `${logPrefix} Input: ${JsonUtils.Stringify(inputForLogging)}.`
    );
    const key: string = this.#computeInvestorIndexPageCacheKey(
      requestId,
      originUrl
    );
    let expiryTime = 300000;
    if (ttl) {
      expiryTime = ttl;
    }
    await this.Set(requestId, key, JsonUtils.Stringify(data), expiryTime);
  }

  public async Delete(requestId: string, key: string): Promise<void> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.Delete.name,
      requestId
    );
    const inputForLogging = {
      key,
    };
    this.#logger.debug(
      `${logPrefix} Input: ${JsonUtils.Stringify(inputForLogging)}.`
    );
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Error deleting cache key ${key}.`,
        `Input: ${JsonUtils.Stringify(inputForLogging)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }

  public async DeleteInvestorProxyHtmlCache(
    requestId: string,
    originUrl: string
  ): Promise<void> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.DeleteInvestorProxyHtmlCache.name,
      requestId
    );
    const inputForLogging = {
      originUrl,
    };
    this.#logger.debug(
      `${logPrefix} Input: ${JsonUtils.Stringify(inputForLogging)}.`
    );
    const key: string = this.#computeInvestorIndexPageCacheKey(
      requestId,
      originUrl
    );
    await this.Delete(requestId, key);
  }

  async GetAuthenticationTokenFromCache(
    requestId: string,
    brokerage: SharedEnums.SupportedBrokerageIntegrationEnum,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto | null> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetAuthenticationTokenFromCache.name,
      requestId
    );
    const key: string = this.generateAuthenticationTokenCacheKey(
      brokerage,
      tenantId
    );
    const inputForLogging = { brokerage, tenantId, key };

    this.#logger.debug(
      `${logPrefix} Start. Payload: ${JsonUtils.Stringify(inputForLogging)}`
    );

    try {
      const value: string | null = await this.Get(requestId, key);
      this.#logger.debug(
        `${logPrefix} Raw payload for [${key}]: ${JsonUtils.Stringify({
          value,
        })}.`
      );

      if (value === null) {
        return null;
      }

      const data: BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto =
        JSON.parse(value);

      this.#logger.debug(
        `${logPrefix} End. Payload: ${JsonUtils.Stringify(data)}`
      );

      return data;
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Error deleting cache key ${key}.`,
        `Input: ${JsonUtils.Stringify(inputForLogging)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }

  private generateAuthenticationTokenCacheKey(
    brokerage: SharedEnums.SupportedBrokerageIntegrationEnum,
    tenantId: string
  ): string {
    return `AUTHENTICATION_TOKEN_${brokerage}_${tenantId}`;
  }

  async SetAuthenticationTokenToCache(
    requestId: string,
    brokerage: SharedEnums.SupportedBrokerageIntegrationEnum,
    tenantId: string,
    ttl: number,
    payload: Record<string, unknown>
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.SetAuthenticationTokenToCache.name,
      requestId
    );
    const key: string = this.generateAuthenticationTokenCacheKey(
      brokerage,
      tenantId
    );
    const inputForLogging = { brokerage, tenantId, key, ttl };
    this.#logger.debug(
      `${logPrefix} Start. Payload: ${JsonUtils.Stringify(inputForLogging)}`
    );
    try {
      await this.Set(requestId, key, JsonUtils.Stringify(payload), ttl);
      this.#logger.debug(`${logPrefix} End.`);
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Error deleting cache key ${key}.`,
        `Input: ${JsonUtils.Stringify(inputForLogging)}.`,
        `Error: ${JsonUtils.Stringify(error)}.`,
      ].join(' ');
      this.#logger.error(errorMessage);
      throw error;
    }
  }
}
