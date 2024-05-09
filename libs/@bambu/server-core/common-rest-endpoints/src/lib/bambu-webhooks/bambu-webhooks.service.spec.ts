import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Observable, of } from 'rxjs';
import { BambuEventEmitterService } from '@bambu/server-core/utilities';
import { BambuWebhookHandler } from './bambu-webhook-handler.base';
import { BambuWebhooksService } from './bambu-webhooks.service';
import { IWebhookPayload } from './types';

class TestWebhookHandler extends BambuWebhookHandler {
  constructor(public readonly data: any = {}) {
    super();
  }

  canHandle(
    headers: Record<string, unknown>,
    body: unknown,
    rawBody: unknown,
    query: Record<string, unknown>,
    path: string
  ) {
    return path !== undefined;
  }

  validate(
    headers: Record<string, unknown>,
    body: unknown,
    rawBody: unknown,
    query: Record<string, unknown>,
    path: string
  ): Observable<unknown> {
    this.data.lastValidated = path;

    if (!path || path !== 'valid/path') {
      throw new BadRequestException('invalid webhook path');
    }
    return of({
      param: 'a validation result',
    });
  }

  getEventName(
    headers: Record<string, unknown>,
    body: unknown,
    rawBody: unknown,
    query: Record<string, unknown>,
    path: string,
    validation: unknown
  ): string {
    const name = path ? 'a.test.event' : undefined;
    this.data.lastEventName = name;
    return name;
  }

  @OnEvent('webhook.a.test.event')
  handleTestEvent(payload: IWebhookPayload) {
    console.log('A test event');
    console.log({ payload });
  }
}

describe('WebhooksService', () => {
  let service: BambuWebhooksService;
  let mockEventEmitter: DeepMockProxy<BambuEventEmitterService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useFactory: () => ({}),
        },
        {
          provide: BambuEventEmitterService,
          useFactory: () => {
            return mockDeep(BambuEventEmitterService);
          },
        },
        BambuWebhooksService,
      ],
    }).compile();

    service = await module.get<BambuWebhooksService>(BambuWebhooksService);
    mockEventEmitter = <DeepMockProxy<BambuEventEmitterService>>(
      await module.get<BambuEventEmitterService>(BambuEventEmitterService)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when initialised', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should contain no registered webhooks', () => {
      expect(service.getWebhooks()).toStrictEqual([]);
    });
  });

  describe('when configuring', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should allow registration of webhooks', () => {
      const webhandler = new TestWebhookHandler();
      expect(service.RegisterWebhook('a webhook', webhandler)).toBe(undefined);

      expect(service.getWebhooks()).toContain('a webhook');

      expect(
        service.RegisterWebhook('a webhook', new TestWebhookHandler())
      ).toBe(webhandler);
    });

    it('should allow unregistering of webhooks', () => {
      const webhandler = new TestWebhookHandler();
      expect(service.RegisterWebhook('another webhook', webhandler)).toBe(
        undefined
      );

      expect(service.getWebhooks()).toContain('another webhook');

      expect(service.UnregisterWebhook('unknown hook')).toBe(undefined);

      expect(service.UnregisterWebhook('another webhook')).toBe(webhandler);

      expect(service.getWebhooks()).not.toContain('another webhook');
    });
  });

  describe('when handling webhooks', () => {
    const handler = new TestWebhookHandler();
    beforeEach(() => {
      jest.clearAllMocks();
      service.RegisterWebhook('a.webhook', handler);
    });

    it('should throw a bad request if no hook is found', async () => {
      const handleHook = service.handleWebhook(undefined, {}, {}, null, {});
      let error;
      await handleHook.subscribe({
        error: (err) => {
          error = err;
        },
      });
      expect(error.message).toBe('No handler found for webhook');
    });

    it('should attempt to validate data if a hook is found', async () => {
      expect(handler.data.lastValidated).toBe(undefined);
      const handleHook = service.handleWebhook('a/path', {}, {}, null, {});
      let error;
      await handleHook.subscribe({
        error: (err) => {
          error = err;
        },
      });
      expect(handler.data.lastValidated).toBe('a/path');
      expect(handler.data.lastEventName).toBe(undefined);
      // This error message comes from the handler
      expect(error.message).toBe('invalid webhook path');
    });

    it('should handle the event a hook is found and the payload is valid', async () => {
      const handleHook = service.handleWebhook('valid/path', {}, {}, null, {});
      let error;
      await handleHook.subscribe({
        error: (err) => {
          error = err;
        },
      });
      expect(handler.data.lastValidated).toBe('valid/path');
      expect(handler.data.lastEventName).toBe('a.test.event');

      expect(mockEventEmitter.emit).toBeCalledWith('webhook.logging', {
        name: 'webhook.a.test.event',
        payload: {
          body: {},
          headers: {},
          path: 'valid/path',
          query: {},
          rawBody: null,
          validationResult: {
            param: 'a validation result',
          },
        },
      });

      expect(mockEventEmitter.emitAsync).toBeCalledWith(
        'webhook.a.test.event',
        {
          body: {},
          headers: {},
          path: 'valid/path',
          query: {},
          rawBody: null,
          validationResult: {
            param: 'a validation result',
          },
        }
      );
    });
  });
});
