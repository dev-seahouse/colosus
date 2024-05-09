import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { BambuEmailerService } from './bambu-emailer.service';
import { Transporter } from 'nodemailer';
import { BambuEventEmitterService } from '../bambu-event-emitter';
import { BambuEmailSendPayload, EmailTransportOptions } from './types';

describe('BambuEmailerService', () => {
  let sut: BambuEmailerService;
  let mockTransporter: DeepMockProxy<Transporter>;
  let logger: Logger;

  beforeAll(async () => {
    mockTransporter = mockDeep<Transporter>();
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BambuEventEmitterService,
          useFactory: () => {
            return mockDeep<EventEmitter2>();
          },
        },
        {
          provide: BambuEmailerService,
          useFactory: (emitterService: BambuEventEmitterService) => {
            logger = mockDeep<Logger>();
            const service = new BambuEmailerService(
              {
                defaultTransport: {
                  host: 'a host',
                  port: 123,
                  secure: true,
                  username: 'someone',
                  password: 'someones password',
                  fromEmailAddress: 'no-reply@bambu.co',
                },
              },
              emitterService,
              logger
            );

            (service as any)['createTransporter'] = (
              config: EmailTransportOptions
            ) => {
              return {
                transporter: mockTransporter,
                config: {},
              };
            };
            return service;
          },
          inject: [BambuEventEmitterService],
        },
      ],
    }).compile();

    sut = await moduleRef.get<BambuEmailerService>(BambuEmailerService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('when calling sendEmail', () => {
    const expectedPayload: BambuEmailSendPayload = {
      header: {
        from: {
          displayName: 'a display name',
          address: 'someone@somewhere.com',
        },
        subject: 'eye catching email',
        to: 'someone.else@somewhere.com',
      },
      body: {
        html: 'html content',
        text: 'text preview',
      },
    };

    beforeAll(async () => {
      jest.clearAllMocks();
      mockTransporter.sendMail.mockResolvedValueOnce({});
      await sut.sendEmail(expectedPayload);
    });

    it('should call sendMail on the transporter', () => {
      expect(mockTransporter.sendMail).toBeCalledWith({
        subject: 'eye catching email',
        from: '"a display name" <someone@somewhere.com>',
        to: 'someone.else@somewhere.com',
        html: expectedPayload.body.html,
        text: expectedPayload.body.text,
      });
    });
  });
});
