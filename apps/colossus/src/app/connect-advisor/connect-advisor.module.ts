import {
  ConnectDomainsModule,
  LaunchModule,
} from '@bambu/server-connect/domains';
import {
  getDefaultFileUploadConfiguration,
  getKeycloakFusionAuthSwitchoverConfiguration,
  getTransactInvestorSwitchoverConfiguration,
  IFileUploadConfigDto,
} from '@bambu/server-core/configuration';
import {
  LegalDocumentsModule,
  RiskProfilingDomainModule,
  TenantBrandingModule,
  TenantModule,
} from '@bambu/server-core/domains';
import { CentralDbRepositoryModule } from '@bambu/server-core/repositories';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ConnectAdvisorController } from './connect-advisor.controller';

/**
 * Note: every endpoint tailored to the Connect advisor onboarding process falls under this controller,
 * even if the backend domain is nots strictly speaking a Connect _advisor_ domain.
 */
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
    ConfigModule.forFeature(getKeycloakFusionAuthSwitchoverConfiguration),
    ConnectDomainsModule,
    CentralDbRepositoryModule,
    TenantModule,
    TenantBrandingModule,
    LegalDocumentsModule,
    RiskProfilingDomainModule,
    LaunchModule,
    ConfigModule.forFeature(getTransactInvestorSwitchoverConfiguration),
  ],
  controllers: [ConnectAdvisorController],
})
export class ConnectAdvisorModule {}
