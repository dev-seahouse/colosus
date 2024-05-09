import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as Luxon from 'luxon';
import { WealthKernelConnectorApisServiceBase } from './apis/wealth-kernel-connector-apis.service';

@Injectable()
export class WealthKernelTokenRenewalService {
  private readonly logger = new Logger(WealthKernelTokenRenewalService.name);

  constructor(
    private readonly wealthKernelConnectorApi: WealthKernelConnectorApisServiceBase
  ) {}

  async Run(): Promise<void> {
    const requestId = crypto.randomUUID();
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Run.name,
      requestId
    );

    this.logger.log(
      `${logPrefix} Starting Wealth Kernel Token Renewal Service.`
    );

    let itemsPresent = true;
    let batchIndex = 0;
    const pageSize = 100;
    let errorCount = 0;

    do {
      this.logger.log(`${logPrefix} Fetching page ${batchIndex}.`);
      const results = await this.wealthKernelConnectorApi.GetTenants(
        requestId,
        batchIndex,
        pageSize
      );

      if (!Array.isArray(results) || results.length === 0) {
        this.logger.log(`${logPrefix} No new items found. Exiting.`);
        itemsPresent = false;
        break;
      }

      batchIndex += 1;

      const numberOfItems: number = results.length;

      for (let i = 0; i < numberOfItems; i += 1) {
        const tenantId = results[i];
        /**
         * Put the logic into a function so maybe, in the future, we can run this in parallel.
         *
         * Put in a unique request ID for each item so when we do a parallel run, we can track which item failed.
         */
        const runRequestId = crypto.randomUUID();
        try {
          await this.processTenantIdToken(
            runRequestId,
            tenantId,
            batchIndex,
            i
          );
        } catch (error) {
          /**
           * Error is now thrown here, so we can cover all users and not just fail on the first error.
           */
          Object.assign(error, {
            tenantId,
            batchIndex,
            itemNumber: i,
            runRequestId,
          });
          this.logger.error(
            `${logPrefix} Error processing tenant ${tenantId}. Error: ${JsonUtils.Stringify(
              error
            )}`
          );

          errorCount += 1;
        }
      }
    } while (itemsPresent);

    if (errorCount > 0) {
      const message = [
        `${logPrefix} There were ${errorCount} errors encountered.`,
        `Please review logs for details`,
      ].join(' ');

      throw new Error(message);
    }

    this.logger.log(
      `${logPrefix} Wealth Kernel Token Renewal Service completed.`
    );
  }

  private async processTenantIdToken(
    requestId: string,
    tenantId: string,
    batchIndex: number,
    itemNumber: number
  ): Promise<void> {
    const { logPrefix: baseLogPrefix } = LoggingUtils.generateLoggingPrefix(
      this.Run.name,
      requestId
    );

    const logPrefix = `${baseLogPrefix} - Batch Index: ${batchIndex} - Item Number: ${itemNumber} -`;

    this.logger.log(`${logPrefix} Processing tenant ${tenantId}.`);

    let token: BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto | null =
      await this.wealthKernelConnectorApi.GetTenantToken(requestId, tenantId);

    if (!token) {
      this.logger.log(`${logPrefix} No token found for tenant ${tenantId}.`);

      token = await this.wealthKernelConnectorApi.SetTenantToken(
        requestId,
        tenantId
      );
    }

    this.logger.debug(`${logPrefix} Token: ${JsonUtils.Stringify(token)}`);

    const thresholdInPercentage = 70;
    const needsRefresh: boolean = this.computeIfTokenNeedsRefresh(
      requestId,
      tenantId,
      token,
      thresholdInPercentage
    );

    if (needsRefresh) {
      this.logger.log(
        `${logPrefix} ${thresholdInPercentage.toString()}% or more of the time has elapsed for token belonging to tenant (${tenantId}). Refreshing token.`
      );

      token = await this.wealthKernelConnectorApi.SetTenantToken(
        requestId,
        tenantId
      );

      this.logger.log(`${logPrefix} Token refreshed for tenant (${tenantId}).`);
      this.logger.debug(
        `${logPrefix} Updated token Token: ${JsonUtils.Stringify(token)}`
      );
    } else {
      this.logger.log(
        `${logPrefix} Token belonging to tenant (${tenantId}) is below the expiry threshold. Skipping token refresh.`
      );
    }
  }

  private computeIfTokenNeedsRefresh(
    requestId: string,
    tenantId: string,
    token: BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto,
    threshold = 70,
    now?: Luxon.DateTime // <-- this is for unit testing, DO NOT USE it in production code.
  ): boolean {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.computeIfTokenNeedsRefresh.name,
      requestId
    );

    this.logger.log(
      `${logPrefix} Checking if token belonging to tenant (${tenantId}) needs a refresh.`
    );
    this.logger.debug(`${logPrefix} Token: ${JsonUtils.Stringify(token)}`);

    // Calculate the percentage of time elapsed
    const percentageTimeElapsed = this.computePercentageTimeElapsed(token, now);
    this.logger.log(
      `${logPrefix} Percentage time elapsed: ${percentageTimeElapsed.toString()}.`
    );

    // Check if threshold has been met or exceeded
    const isLapsed = percentageTimeElapsed >= threshold;

    this.logger.log(
      `${logPrefix} Has token for tenant (${tenantId}) lapsed? ${
        isLapsed ? 'Y' : 'N'
      }.`
    );

    return isLapsed;
  }

  private computePercentageTimeElapsed(
    token: BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto,
    now?: Luxon.DateTime // <-- this is for unit testing, DO NOT USE it in production code.
  ): number {
    const { lifespanInSeconds, inceptionDateIsoString } = token;

    const inceptionDate = Luxon.DateTime.fromISO(inceptionDateIsoString);
    const inceptionUnixEpoch = inceptionDate.toSeconds();

    const expiryDate = Luxon.DateTime.fromISO(inceptionDateIsoString).plus({
      seconds: lifespanInSeconds,
    });
    const expiryUnixEpoch: number = expiryDate.toSeconds();

    const nowUnixEpoch: number = (now || Luxon.DateTime.now()).toSeconds();

    // Calculate total lifespan in seconds
    const totalLifespanInSeconds: number = expiryUnixEpoch - inceptionUnixEpoch;

    // Calculate elapsed time in seconds
    const elapsedSeconds: number = nowUnixEpoch - inceptionUnixEpoch;

    // Calculate the percentage of time elapsed
    return (elapsedSeconds / totalLifespanInSeconds) * 100;
  }
}
