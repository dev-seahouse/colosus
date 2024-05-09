// noinspection ES6PreferShortImport

import { getDefaultBambuEmailerConfiguration } from '@bambu/server-core/configuration';
import { BambuEmailerModule } from '@bambu/server-core/utilities';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationRepositoryServiceBase } from './notification-repository-service.base';
import { NotificationRepositoryService } from './notification-repository.service';
import { NotificationTypeEnum } from './notification-type.enum';

describe('libs/@bambu/server-core/repositories/src/lib/notification-repository/notification-repository.service.spec.ts', () => {
  describe('e2e integration testing, mainly for isolated development', () => {
    let repository: NotificationRepositoryServiceBase;

    beforeEach(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forFeature(getDefaultBambuEmailerConfiguration),
          BambuEmailerModule,
        ],
        providers: [
          {
            provide: NotificationRepositoryServiceBase,
            useClass: NotificationRepositoryService,
          },
        ],
      }).compile();

      repository = await moduleRef.get<NotificationRepositoryServiceBase>(
        NotificationRepositoryServiceBase
      );
    });

    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

    it.skip('should send emails', async () => {
      await repository.NotifyUser({
        from: 'mailservice@bambu.life',
        to: 'ben@pintu.dk',
        body: '<div>lalala</div>',
        subject: 'this is a test',
        type: NotificationTypeEnum.EMAIL,
      });
    });
  });
});
