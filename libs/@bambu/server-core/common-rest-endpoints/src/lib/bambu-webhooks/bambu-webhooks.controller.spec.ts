import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { of } from 'rxjs';
import { BambuWebhooksController } from './bambu-webhooks.controller';
import { BambuWebhooksService } from './bambu-webhooks.service';

describe('WebhooksController', () => {
  let sut: BambuWebhooksController;
  let serviceMock: DeepMockProxy<BambuWebhooksService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BambuWebhooksController],
      providers: [
        {
          provide: ConfigService,
          useFactory: () => ({}),
        },
        {
          provide: BambuWebhooksService,
          useFactory: () => {
            return mockDeep<BambuWebhooksService>();
          },
        },
      ],
    }).compile();

    sut = await module.get<BambuWebhooksController>(BambuWebhooksController);
    serviceMock = <DeepMockProxy<BambuWebhooksService>>(
      await module.get<BambuWebhooksService>(BambuWebhooksService)
    );
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('when calling handle webhook', () => {
    let response: unknown;
    const expectedHeaders = {
      'content-type': 'application/json',
      'user-agent': 'PostmanRuntime/7.29.2',
      accept: '*/*',
      'postman-token': '7a47285d-c71c-4ee1-a80f-3897caae6b52',
      host: 'localhost:9002',
      'accept-encoding': 'gzip, deflate, br',
      connection: 'keep-alive',
      'content-length': '27',
    };
    const expectedBody = {
      test: 'something',
    };
    const expectedRawBody = Buffer.from('expectedRawBody');
    const expectedRequest = {
      rawBody: expectedRawBody,
    } as RawBodyRequest<Request>;

    const expectedQuery = {
      query: 'string',
    };

    beforeEach(() => {
      jest.clearAllMocks();
      serviceMock.handleWebhook.mockReturnValue(of<unknown>('a mock response'));
      sut
        .handleWebhook(
          'somewhere',
          expectedHeaders,
          expectedBody,
          expectedQuery,
          expectedRequest
        )
        .subscribe({
          next: (result: unknown) => {
            response = result;
          },
        });
    });
    it('should call handleWebhook on the service', () => {
      expect(serviceMock.handleWebhook).toBeCalledWith(
        'somewhere',
        expectedHeaders,
        expectedBody,
        expectedRawBody,
        expectedQuery
      );

      expect(response).toBe('a mock response');
    });
  });
});
