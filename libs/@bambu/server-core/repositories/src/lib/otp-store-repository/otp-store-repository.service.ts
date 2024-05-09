// noinspection ES6PreferShortImport

import { Prisma } from '@bambu/colossus/prisma/central-db';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { OtpDto } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { OtpCentralDbRepositoryService } from '../central-db-repository';
import { OtpStoreRepositoryServiceBase } from './otp-store-repository.service.base';

@Injectable()
export class OtpStoreRepositoryService
  implements OtpStoreRepositoryServiceBase
{
  readonly #logger: Logger = new Logger(OtpStoreRepositoryServiceBase.name);

  constructor(private readonly otpRepository: OtpCentralDbRepositoryService) {}

  public async InvalidateOtpsThenRegisterOtp({
    otp,
    tenantId,
    userId,
    purpose,
    mode,
    ttlInSeconds,
  }: OtpDto.IOtpDto): Promise<void> {
    const logPrefix = `${this.InvalidateOtpsThenRegisterOtp.name} -`;
    try {
      await this.otpRepository.updateMany({
        where: {
          tenantId,
          userId,
          purpose,
          // Note: currently, we invalidate across all modes and expiry dates
          otpState: 'UNUSED',
        },
        data: {
          otpState: 'INVALIDATED',
        },
      });
      await this.otpRepository.create({
        data: {
          otp,
          purpose,
          mode,
          Tenant: { connect: { id: tenantId } },
          User: { connect: { id: userId } },
          expiresAt: new Date(Date.now() + ttlInSeconds * 1000),
        },
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  public async InvalidateOtpsThenRegisterOtpForInvestorPlatformUser(
    requestId: string,
    { otp, tenantId, userId, purpose, mode, ttlInSeconds }: OtpDto.IOtpDto
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.InvalidateOtpsThenRegisterOtp.name,
      requestId
    );
    try {
      await this.otpRepository.updateMany({
        where: {
          tenantId,
          investorPlatformUserId: userId,
          purpose,
          // Note: currently, we invalidate across all modes and expiry dates
          otpState: 'UNUSED',
        },
        data: {
          otpState: 'INVALIDATED',
        },
      });
      await this.otpRepository.create({
        data: {
          otp,
          purpose,
          mode,
          Tenant: { connect: { id: tenantId } },
          InvestorPlatformUser: { connect: { id: userId } },
          expiresAt: new Date(Date.now() + ttlInSeconds * 1000),
        },
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  public async VerifyOtp({
    otp,
    tenantId,
    userId,
    purpose,
    mode,
  }: OtpDto.IOtpDto): Promise<boolean> {
    const logPrefix = `${this.InvalidateOtpsThenRegisterOtp.name} -`;
    try {
      const { count } = (await this.otpRepository.updateMany({
        where: {
          OR: [{ userId }, { investorPlatformUserId: userId }],
          tenantId,
          purpose,
          otp,
          mode,
          // Note: currently, we invalidate across all modes
          otpState: 'UNUSED',
          expiresAt: {
            gte: new Date(Date.now()),
          },
        },
        data: {
          otpState: 'USED',
        },
        // We make the dependency on the Prisma types explicit here; this should help avoid failing to detect issues if we move to another implementation.
      })) as Prisma.BatchPayload;
      return count >= 1;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(error)}`
      );
      throw error;
    }
  }

  public async PendingOtpIsPresent(
    requestId: string,
    tenantId: string,
    userId: string,
    purpose: keyof typeof OtpDto.OtpPurposeDataMap
  ): Promise<boolean> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.PendingOtpIsPresent.name,
      requestId
    );
    try {
      const result = await this.otpRepository.count({
        where: {
          tenantId,
          purpose,
          otpState: 'UNUSED',
          OR: [
            {
              userId,
            },
            {
              investorPlatformUserId: userId,
            },
          ],
        },
      });
      return (result as number) > 0;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error encountered. Details: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }
}
