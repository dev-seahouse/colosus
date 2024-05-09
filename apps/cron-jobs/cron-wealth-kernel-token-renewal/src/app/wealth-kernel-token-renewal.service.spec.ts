process.env.STRIPE_SECRET_KEY = 'STRIPE_SECRET_KEY';
process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET = 'STRIPE_WEBHOOK_ENDPOINT_SECRET';

import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { Test } from '@nestjs/testing';
import * as crypto from 'crypto';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import * as _ from 'lodash';
import * as Luxon from 'luxon';
import { WealthKernelConnectorApisServiceBase } from './apis/wealth-kernel-connector-apis.service';
import { WealthKernelTokenRenewalService } from './wealth-kernel-token-renewal.service';

describe('WealthKernelTokenRenewalService', () => {
  let service: WealthKernelTokenRenewalService;
  const wealthKernelConnectorApisServiceMock: DeepMockProxy<WealthKernelConnectorApisServiceBase> =
    mockDeep<WealthKernelConnectorApisServiceBase>();

  beforeAll(async () => {
    mockReset(wealthKernelConnectorApisServiceMock);

    const app = await Test.createTestingModule({
      providers: [
        {
          provide: WealthKernelConnectorApisServiceBase,
          useValue: wealthKernelConnectorApisServiceMock,
        },
        WealthKernelTokenRenewalService,
      ],
    }).compile();

    service = app.get<WealthKernelTokenRenewalService>(
      WealthKernelTokenRenewalService
    );
  });

  it('should have the Run entry point method defined.', () => {
    expect(service.Run).toBeDefined();
  });

  it('should not crash if no tenants found.', async () => {
    wealthKernelConnectorApisServiceMock.GetTenants.mockResolvedValueOnce([]);
    await expect(service.Run()).resolves.not.toThrow();
  });

  const defaultToken: BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto =
    {
      inceptionDateIsoString: '2021-01-01T00:00:00.000Z',
      lifespanInSeconds: 3600,
      scope: 'scope',
      token: 'token',
      tokenType:
        BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenTypeEnum
          .BEARER,
      rawData: {},
    };

  it('should be able to create new tokens is token not cached.', async () => {
    const tenantId = crypto.randomUUID();

    wealthKernelConnectorApisServiceMock.GetTenants.mockResolvedValueOnce([
      tenantId,
    ]);
    wealthKernelConnectorApisServiceMock.GetTenantToken.mockResolvedValueOnce(
      null
    );
    wealthKernelConnectorApisServiceMock.SetTenantToken.mockResolvedValue({
      ...defaultToken,
    });

    await expect(service.Run()).resolves.not.toThrow();
  });

  it('should refresh token if token is expired.', async () => {
    const tenantId = crypto.randomUUID();

    wealthKernelConnectorApisServiceMock.GetTenants.mockResolvedValueOnce([
      tenantId,
    ]);
    wealthKernelConnectorApisServiceMock.GetTenantToken.mockResolvedValueOnce({
      ...defaultToken,
    });
    wealthKernelConnectorApisServiceMock.SetTenantToken.mockResolvedValue({
      ...defaultToken,
    });

    await expect(service.Run()).resolves.not.toThrow();
  });

  describe('computePercentageTimeElapsed', () => {
    it('should compute percentage time elapsed correctly.', () => {
      const clonedToken = _.cloneDeep(defaultToken);

      const now = Luxon.DateTime.local({
        zone: 'utc',
      });

      const expiryTime = now.plus({ seconds: 3600 });

      const thirtyPercentOfExpiryTimeInSeconds = 3600 * 0.3;
      const thirtyPercentBeforeExpiryTime = expiryTime.minus({
        seconds: thirtyPercentOfExpiryTimeInSeconds,
      });

      clonedToken.inceptionDateIsoString = now.toISO();
      clonedToken.lifespanInSeconds = 3600;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const actual = (service as any).computePercentageTimeElapsed(
        clonedToken,
        thirtyPercentBeforeExpiryTime // <-- pass the test "now" time here
      );

      expect(actual).toEqual(70);
    });
  });

  describe('computeIfTokenNeedsRefresh', () => {
    it(`should return true if token's lifespan has crossed the threshold.`, () => {
      const clonedToken = _.cloneDeep(defaultToken);

      const now = Luxon.DateTime.local({
        zone: 'utc',
      });

      const expiryTime = now.plus({ seconds: 3600 });

      const thirtyPercentOfExpiryTimeInSeconds = 3600 * 0.3;
      const thirtyPercentBeforeExpiryTime = expiryTime.minus({
        seconds: thirtyPercentOfExpiryTimeInSeconds,
      });

      clonedToken.inceptionDateIsoString = now.toISO();
      clonedToken.lifespanInSeconds = 3600;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const actual = (service as any).computeIfTokenNeedsRefresh(
        crypto.randomUUID(),
        crypto.randomUUID(),
        clonedToken,
        70,
        thirtyPercentBeforeExpiryTime
      );

      expect(actual).toEqual(true);
    });

    it("should return false if token's lifespan has not crossed the threshold..", () => {
      const clonedToken = _.cloneDeep(defaultToken);

      const now = Luxon.DateTime.local({
        zone: 'utc',
      });

      clonedToken.inceptionDateIsoString = now.toISO();
      clonedToken.lifespanInSeconds = 3600;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const actual = (service as any).computeIfTokenNeedsRefresh(
        crypto.randomUUID(),
        crypto.randomUUID(),
        clonedToken,
        70,
        now
      );

      expect(actual).toEqual(false);
    });
  });
});
