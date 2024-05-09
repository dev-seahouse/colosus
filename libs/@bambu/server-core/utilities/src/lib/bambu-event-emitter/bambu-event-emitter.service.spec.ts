import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { BambuEventEmitterService } from './bambu-event-emitter.service';

describe('BambuEventEmitterService', () => {
  let sut: BambuEventEmitterService;
  let mockEmitter: EventEmitter2;
  let logger: Logger;

  beforeAll(async () => {
    mockEmitter = mockDeep<EventEmitter2>();
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EventEmitter2,
          useFactory: () => {
            return mockDeep<EventEmitter2>();
          },
        },
        {
          provide: BambuEventEmitterService,
          useFactory: (emitterService: EventEmitter2) => {
            logger = mockDeep<Logger>();
            return new BambuEventEmitterService(logger, emitterService);
          },
          inject: [EventEmitter2],
        },
      ],
    }).compile();

    sut = await moduleRef.get<BambuEventEmitterService>(
      BambuEventEmitterService
    );

    mockEmitter = await moduleRef.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('when calling emit', () => {
    const expectedName = 'an.event.with.namespaces';
    const expectedPayload = {
      test: 1,
    };

    beforeAll(() => {
      jest.clearAllMocks();
      sut.emit(expectedName, expectedPayload);
    });

    it('should call emit on the EventEmitter with the appropriate values', () => {
      expect(mockEmitter.emit).toBeCalledWith(expectedName, expectedPayload);
    });
  });

  describe('when calling emitAsync', () => {
    const expectedName = 'an.event.with.namespaces';
    const expectedPayload = {
      test: 1,
    };

    beforeAll(() => {
      jest.clearAllMocks();
      sut.emitAsync(expectedName, expectedPayload);
    });

    it('should call emit on the EventEmitter with the appropriate values', () => {
      expect(mockEmitter.emitAsync).toBeCalledWith(
        expectedName,
        expectedPayload
      );
    });
  });
});
