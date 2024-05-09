import {
  getDefaultFileUploadConfiguration,
  getInvestorClientConfiguration,
  IFileUploadConfigDto,
} from '@bambu/server-core/configuration';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import { TenantBrandingController } from './tenant-branding.controller';
import {
  TenantBrandingModule as TenantBrandingDomainModule,
  TenantModule,
} from '@bambu/server-core/domains';
import { CentralDbRepositoryModule } from '@bambu/server-core/repositories';
import { ConnectDomainsModule } from '@bambu/server-connect/domains';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule.forFeature(getDefaultFileUploadConfiguration)],
      useFactory: (fileUploadConfig: ConfigService<IFileUploadConfigDto>) => {
        const { tmpFileDir } = fileUploadConfig.get(
          'fileUpload'
        ) as IFileUploadConfigDto['fileUpload'];
        return {
          dest: tmpFileDir,
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forFeature(getInvestorClientConfiguration),
    TenantBrandingDomainModule,
    TenantModule,
    CentralDbRepositoryModule,
    ConnectDomainsModule,
  ],
  controllers: [TenantBrandingController],
})
export class TenantBrandingModule {}
