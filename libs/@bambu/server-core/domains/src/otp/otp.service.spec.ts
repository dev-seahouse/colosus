// noinspection ES6PreferShortImport

process.env.STRIPE_SECRET_KEY = 'STRIPE_SECRET_KEY';
process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET = 'STRIPE_WEBHOOK_ENDPOINT_SECRET';
process.env.AZURE_STORAGE_CONNECTION_STRING = 'stub for testing';
process.env.AZURE_STORAGE_PUBLIC_SYSTEM_ASSETS_PUBLIC_BASE_URL =
  'stub for testing';
process.env.AZURE_STORAGE_ADVISOR_PUBLIC_ASSETS_PUBLIC_BASE_URL =
  'stub for testing';

import {
  NotificationRepositoryServiceBase,
  NotificationTemplateChannelEnum,
  NotificationTemplatesRepositoryServiceBase,
  NotificationTypeEnum,
  OtpStoreRepositoryServiceBase,
  TemplateNameEnum,
  TenantCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import { OtpUtils } from '@bambu/server-core/utilities';
import { OtpDto } from '@bambu/shared';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import { OtpService } from './otp.service';
import { OtpServiceBase } from './otp.service.base';

describe('OtpService', () => {
  let service: OtpServiceBase;

  const otpRepositoryServiceBase: DeepMockProxy<OtpStoreRepositoryServiceBase> =
    mockDeep<OtpStoreRepositoryServiceBase>();

  const configServiceMock: DeepMockProxy<ConfigService> =
    mockDeep<ConfigService>();

  const notificationTemplatesRepositoryServiceBaseMock: DeepMockProxy<NotificationTemplatesRepositoryServiceBase> =
    mockDeep<NotificationTemplatesRepositoryServiceBase>();

  const notificationRepositoryServiceBaseMock: DeepMockProxy<NotificationRepositoryServiceBase> =
    mockDeep<NotificationRepositoryServiceBase>();

  const tenantCentralDbRepositoryServiceMock: DeepMockProxy<TenantCentralDbRepositoryService> =
    mockDeep<TenantCentralDbRepositoryService>();

  beforeEach(async () => {
    mockReset(otpRepositoryServiceBase);
    mockReset(configServiceMock);
    mockReset(notificationTemplatesRepositoryServiceBaseMock);
    mockReset(notificationRepositoryServiceBaseMock);
    mockReset(tenantCentralDbRepositoryServiceMock);

    configServiceMock.getOrThrow.mockReturnValue({
      secret: 'i-am-colossus',
      otpEnabled: 1,
      connectAdvisorBaseUrl: 'http://127.0.0.1:4200',
      stubbedOtp: null,
    });
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: OtpStoreRepositoryServiceBase,
          useValue: otpRepositoryServiceBase,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: NotificationTemplatesRepositoryServiceBase,
          useValue: notificationTemplatesRepositoryServiceBaseMock,
        },
        {
          provide: NotificationRepositoryServiceBase,
          useValue: notificationRepositoryServiceBaseMock,
        },
        {
          provide: OtpServiceBase,
          useClass: OtpService,
        },
        {
          provide: TenantCentralDbRepositoryService,
          useValue: tenantCentralDbRepositoryServiceMock,
        },
      ],
    }).compile();
    service = moduleRef.get<OtpServiceBase>(OtpServiceBase);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('SendOtp', () => {
    it('should have SendOtp defined', () => {
      expect(service.SendOtp).toBeDefined();
    });

    describe('when called with valid email parameters', () => {
      it('should attempt to invalidate existing registered OTPs in the DB, and register a new OTP', async () => {
        expect.assertions(3);
        otpRepositoryServiceBase.InvalidateOtpsThenRegisterOtp.mockResolvedValue(
          undefined
        );
        const result = await service.SendOtp({
          tenantId: '1234455',
          userId: '238128',
          purpose: 'INITIAL_EMAIL_VERIFICATION',
          mode: OtpDto.EnumOtpMode.EMAIL,
          email: 'alpha@beta.com',
        });
        expect(result).toBeUndefined();
        expect(
          otpRepositoryServiceBase.InvalidateOtpsThenRegisterOtp
        ).toBeCalledTimes(1);
        expect(
          otpRepositoryServiceBase.InvalidateOtpsThenRegisterOtp
        ).lastCalledWith(
          expect.objectContaining({
            tenantId: '1234455',
            userId: '238128',
            purpose: 'INITIAL_EMAIL_VERIFICATION',
            mode: OtpDto.EnumOtpMode.EMAIL,
            email: 'alpha@beta.com',
          })
        );
      });

      it('upon an email otp request should call the notification templates repository to generate an appropriate template with an OTP', async () => {
        expect.assertions(4);
        otpRepositoryServiceBase.InvalidateOtpsThenRegisterOtp.mockResolvedValue(
          undefined
        );
        notificationTemplatesRepositoryServiceBaseMock.GenerateTemplatedMessage.mockResolvedValue(
          'The otp is: 839210'
        );
        const result = await service.SendOtp({
          tenantId: '1234455',
          userId: '238128',
          purpose: 'INITIAL_EMAIL_VERIFICATION',
          mode: OtpDto.EnumOtpMode.EMAIL,
          email: 'alpha@beta.com',
        });
        expect(result).toBeUndefined();
        const otp =
          otpRepositoryServiceBase.InvalidateOtpsThenRegisterOtp.mock
            .lastCall?.[0].otp;
        expect(
          notificationTemplatesRepositoryServiceBaseMock.GenerateTemplatedMessage
        ).toBeCalledTimes(1);
        expect(
          notificationTemplatesRepositoryServiceBaseMock.GenerateTemplatedMessage
        ).lastCalledWith(
          expect.objectContaining({
            channel: NotificationTemplateChannelEnum.EMAIL,
            templateName: TemplateNameEnum.VERIFY_LOGIN_OTP,
          })
        );
        const calledParams =
          notificationTemplatesRepositoryServiceBaseMock
            .GenerateTemplatedMessage.mock.lastCall?.[0];
        expect(calledParams.parameters['otpGroupedDigits'].join('')).toEqual(
          otp
        );
      });

      it('should attempt to send an OTP by the notification repository', async () => {
        expect.assertions(3);
        otpRepositoryServiceBase.InvalidateOtpsThenRegisterOtp.mockResolvedValue(
          undefined
        );
        notificationTemplatesRepositoryServiceBaseMock.GenerateTemplatedMessage.mockResolvedValue(
          'The otp is: 839210'
        );
        const result = await service.SendOtp({
          tenantId: '1234455',
          userId: '238128',
          purpose: 'INITIAL_EMAIL_VERIFICATION',
          mode: OtpDto.EnumOtpMode.EMAIL,
          email: 'alpha@beta.com',
        });
        expect(result).toBeUndefined();
        expect(
          notificationRepositoryServiceBaseMock.NotifyUser
        ).toBeCalledTimes(1);
        expect(notificationRepositoryServiceBaseMock.NotifyUser).lastCalledWith(
          {
            body: expect.stringContaining('839210'),
            type: NotificationTypeEnum.EMAIL,
            to: 'alpha@beta.com',
            subject: expect.stringContaining('erify'),
          }
        );
      });
    });
  });

  describe('VerifyOtp', () => {
    it('should have VerifyOtp defined', () => {
      expect(service.VerifyOtp).toBeDefined();
    });

    describe('when called with valid email parameters', () => {
      it('should successfully verify it, with the result dependent on the secret configured for OtpService', async () => {
        expect.assertions(1);
        otpRepositoryServiceBase.VerifyOtp.mockResolvedValueOnce(true);
        const otpParams = {
          tenantId: '1234455',
          userId: '238128',
          purpose: 'INITIAL_EMAIL_VERIFICATION',
          mode: OtpDto.EnumOtpMode.EMAIL,
          ttlInSeconds: 300,
        } as const;
        const otp = OtpUtils.generateOtp(otpParams, 'i-am-colossus');
        const result = await service.VerifyOtp({ ...otpParams, otp });
        expect(result).toBe(true);
      });
      it('should persist the fact that the otp has been verified', async () => {
        expect.assertions(2);
        otpRepositoryServiceBase.VerifyOtp.mockResolvedValueOnce(true);
        const otpParams = {
          tenantId: '1234455',
          userId: '238128',
          purpose: 'INITIAL_EMAIL_VERIFICATION',
          mode: OtpDto.EnumOtpMode.EMAIL,
          ttlInSeconds: 300,
        } as const;
        const otp = OtpUtils.generateOtp(otpParams, 'i-am-colossus');
        await service.VerifyOtp({ ...otpParams, otp });
        expect(otpRepositoryServiceBase.VerifyOtp).toBeCalledTimes(1);
        expect(otpRepositoryServiceBase.VerifyOtp).lastCalledWith(
          expect.objectContaining({
            ...otpParams,
            otp,
          })
        );
      });
    });
  });
});
