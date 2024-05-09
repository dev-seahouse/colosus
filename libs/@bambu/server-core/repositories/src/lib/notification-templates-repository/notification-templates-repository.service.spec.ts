// noinspection ES6PreferShortImport

function applyStubEnvVarValues(stubValue = 'stub-for-testing') {
  process.env.STRIPE_SECRET_KEY = stubValue;
  process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET = stubValue;
  process.env.AZURE_STORAGE_CONNECTION_STRING = stubValue;
  process.env.AZURE_STORAGE_PUBLIC_SYSTEM_ASSETS_PUBLIC_BASE_URL = stubValue;
  process.env.AZURE_STORAGE_ADVISOR_PUBLIC_ASSETS_PUBLIC_BASE_URL = stubValue;
}

applyStubEnvVarValues();

import { getAzureBlobStorageConfiguration } from '@bambu/server-core/configuration';
import { BambuEmailerModule } from '@bambu/server-core/utilities';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as ejs from 'ejs';
import { NotificationTemplateChannelEnum } from './notification-template-channel.enum';
import { NotificationTemplatesRepositoryServiceBase } from './notification-templates-repository-service.base';
import { NotificationTemplatesRepositoryService } from './notification-templates-repository.service';
import { TemplateNameEnum } from './template-name.enum';

jest.mock('ejs');

describe('libs/@bambu/server-core/repositories/notification-templates-repository.service.spec.ts', () => {
  let repository: NotificationTemplatesRepositoryServiceBase;

  beforeEach(async () => {
    applyStubEnvVarValues();

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(getAzureBlobStorageConfiguration),
        BambuEmailerModule,
      ],
      providers: [
        {
          provide: NotificationTemplatesRepositoryServiceBase,
          useClass: NotificationTemplatesRepositoryService,
        },
      ],
    }).compile();

    repository =
      await moduleRef.get<NotificationTemplatesRepositoryServiceBase>(
        NotificationTemplatesRepositoryServiceBase
      );
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('when called with valid parameters to generate a LaunchPlatform template, should call ejs.render with suitable parameters', async () => {
    expect.assertions(3);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ejs.render as any).mockReturnValueOnce('rendered template');
    const parameters = {
      url: 'https://www.google.com',
      supportEmail: 'support@bambu.co',
    };
    const res = await repository.GenerateTemplatedMessage({
      templateName: TemplateNameEnum.LAUNCH_PLATFORM,
      channel: NotificationTemplateChannelEnum.EMAIL,
      parameters,
    });

    expect(ejs.render).toHaveBeenCalledTimes(1);
    expect(ejs.render).lastCalledWith(
      expect.any(String),
      parameters,
      expect.any(Object)
    );
    expect(res).toBe('rendered template');
  });

  it('when called with valid parameters to generate a VerifyLoginOtp template, should call ejs.render with suitable parameters', async () => {
    expect.assertions(3);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ejs.render as any).mockReturnValueOnce('rendered template');
    const parameters = {
      timeout: 5,
      otpGroupedDigits: ['123', '456'],
      supportEmail: 'support@bambu.co',
    };
    const res = await repository.GenerateTemplatedMessage({
      templateName: TemplateNameEnum.VERIFY_LOGIN_OTP,
      channel: NotificationTemplateChannelEnum.EMAIL,
      parameters,
    });

    expect(ejs.render).toHaveBeenCalledTimes(1);
    expect(ejs.render).lastCalledWith(
      expect.any(String),
      parameters,
      expect.any(Object)
    );
    expect(res).toBe('rendered template');
  });

  it('when called with valid parameters to generate a ResetPasswordOtp template, should call ejs.render with suitable parameters', async () => {
    expect.assertions(3);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ejs.render as any).mockReturnValueOnce('rendered template');
    const parameters = {
      timeout: 5,
      url: 'https://google.com/',
    };
    const res = await repository.GenerateTemplatedMessage({
      templateName: TemplateNameEnum.RESET_PASSWORD_OTP,
      channel: NotificationTemplateChannelEnum.EMAIL,
      parameters,
    });

    expect(ejs.render).toHaveBeenCalledTimes(1);
    expect(ejs.render).lastCalledWith(
      expect.any(String),
      parameters,
      expect.any(Object)
    );
    expect(res).toBe('rendered template');
  });
});
