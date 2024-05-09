// noinspection ES6PreferShortImport

import { Enums } from '@bambu/server-core/constants';
import { IColossusTrackingDto } from '@bambu/server-core/dto';
import {
  BlobRepositoryServiceBase,
  ConnectTenantCentralDbRepositoryService,
  TenantBrandingCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { Injectable, Logger } from '@nestjs/common';
import {
  ISetBrandingInputDto,
  TenantBrandingServiceBase,
  ITenantBrandingDto,
} from './tenant-branding.service.base';
import { generateCDNUrl } from '@bambu/server-core/configuration';

@Injectable()
export class TenantBrandingService implements TenantBrandingServiceBase {
  readonly #logger = new Logger(TenantBrandingService.name);

  constructor(
    private readonly blobRepository: BlobRepositoryServiceBase,
    private readonly tenantBrandingCentralDb: TenantBrandingCentralDbRepositoryService,
    private readonly connectTenantCentralDb: ConnectTenantCentralDbRepositoryService
  ) {}

  async UploadLogo({
    tenantId,
    filePath,
    originalFilename,
    contentType,
    tracking,
  }: {
    tenantId: string;
    filePath: string;
    originalFilename: string;
    contentType: string;
    tracking: IColossusTrackingDto;
  }): Promise<string> {
    const branding = await this.tenantBrandingCentralDb.GetTenantBranding({
      tenantId,
    });
    if (branding.logoUrl) {
      await this.blobRepository.DeleteBlob(branding.logoUrl as string, '');
    }
    const logoUrl = await this.blobRepository.CreatePublicBlobFromLocalFile(
      filePath,
      contentType,
      Enums.FileUpload.Paths.TENANT_BRANDING,
      originalFilename
    );
    await this.tenantBrandingCentralDb.SetTenantBrandingWithLogoUrl({
      ...branding,
      tenantId,
      logoUrl,
    });

    await this.#updateBrandingState(tracking, tenantId);

    return logoUrl;
  }

  async DeleteLogo({
    tenantId,
    tracking,
  }: {
    tenantId: string;
    tracking: IColossusTrackingDto;
  }): Promise<void> {
    const branding = await this.tenantBrandingCentralDb.GetTenantBranding({
      tenantId,
    });
    if (branding && branding.logoUrl) {
      await this.blobRepository.DeleteBlob(branding.logoUrl as string, '');
      await this.tenantBrandingCentralDb.SetTenantBrandingWithLogoUrl({
        ...branding,
        tenantId,
        logoUrl: null,
      });
    }

    await this.#updateBrandingState(tracking, tenantId);
  }

  async SetBranding(params: ISetBrandingInputDto): Promise<void> {
    const {
      tracking: { requestId, requesterId },
      tenantId,
      trackPlatformSetupProgress,
    } = params;
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.SetBranding.name,
      requestId
    );
    try {
      await this.tenantBrandingCentralDb.SetTenantBranding({
        tenantId,
        userId: requesterId,
        brandColor: params.brandColor,
        headerBgColor: params.headerBgColor,
        tradeName: params.tradeName,
      });

      if (!trackPlatformSetupProgress) {
        return;
      }

      await this.#updateBrandingState(params.tracking, tenantId);
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error setting tenant branding: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  async #updateBrandingState(
    tracking: IColossusTrackingDto,
    tenantId: string
  ): Promise<void> {
    const { requestId, requesterId } = tracking;
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.#updateBrandingState.name,
      requestId
    );

    try {
      const currentBranding = await this.GetBranding({ tenantId });

      const logoInPlace: boolean =
        currentBranding &&
        currentBranding.logoUrl !== undefined &&
        currentBranding.logoUrl !== null &&
        typeof currentBranding.logoUrl === 'string' &&
        currentBranding.logoUrl.trim().length > 0;

      const tradeNameInPlace: boolean =
        currentBranding &&
        currentBranding.tradeName !== undefined &&
        currentBranding.tradeName !== null &&
        typeof currentBranding.tradeName === 'string' &&
        currentBranding.tradeName.trim().length > 0;

      const brandingGoodToGo: boolean = logoInPlace || tradeNameInPlace;

      await this.connectTenantCentralDb.UpdateConnectTenantSetupState(
        requestId,
        tenantId,
        {
          hasUpdatedBranding: brandingGoodToGo,
        },
        requesterId
      );
    } catch (error) {
      const message = `${logPrefix} Error encountered: ${JsonUtils.Stringify(
        error
      )}.`;
      this.#logger.error(message);
      throw error;
    }
  }

  async GetBranding({
    tenantId,
  }: {
    tenantId: string;
  }): Promise<ITenantBrandingDto | null> {
    const logPrefix = `${this.GetBranding.name} -`;
    try {
      const ret = await this.tenantBrandingCentralDb.GetTenantBranding({
        tenantId,
      });

      // Modify blob logo url with CDN URL
      if (
        ret.logoUrl &&
        typeof ret.logoUrl === 'string' &&
        ret.logoUrl.trim().length > 0
      ) {
        const extractedFileName = ret.logoUrl.substring(
          ret.logoUrl.indexOf('/tenant-branding')
        );
        ret.logoUrl = generateCDNUrl(extractedFileName);
        // return modified branding data
      }

      return ret;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting tenant branding: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }

  async InitializeBranding({ tenantId }: { tenantId: string }): Promise<void> {
    const logPrefix = `${this.InitializeBranding.name} -`;
    try {
      const ret = await this.tenantBrandingCentralDb.InitializeTenantBranding({
        tenantId,
      });
      return ret;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting tenant branding: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw error;
    }
  }
}
