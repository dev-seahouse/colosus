import { ConnectAdvisorServiceBase } from '@bambu/server-connect/domains';
import { IKeycloakFusionAuthSwitchoverConfigDto } from '@bambu/server-core/configuration';
import {
  LegalDocumentsServiceBase,
  TenantBrandingServiceBase,
  TenantServiceBase,
  RiskProfilingDomainServiceBase,
} from '@bambu/server-core/domains';
import {
  ConnectPortfolioSummaryCentralDbRepositoryService,
  ConnectTenantGoalTypeCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import { SharedEnums } from '@bambu/shared';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ConnectAdvisorController } from './connect-advisor.controller';
import * as Dto from './dto';

describe('ConnectAdvisorController', () => {
  let controller: ConnectAdvisorController;

  const keycloakFusionAuthSwitchoverConfigMock: DeepMockProxy<
    ConfigService<IKeycloakFusionAuthSwitchoverConfigDto>
  > = mockDeep<ConfigService<IKeycloakFusionAuthSwitchoverConfigDto>>();
  const connectAdvisorServiceMock: DeepMockProxy<ConnectAdvisorServiceBase> =
    mockDeep<ConnectAdvisorServiceBase>();
  const connectTenantGoalTypeCentralDbRepositoryMock: DeepMockProxy<ConnectTenantGoalTypeCentralDbRepositoryService> =
    mockDeep<ConnectTenantGoalTypeCentralDbRepositoryService>();
  const connectPortfolioSummaryCentralDbRepositoryMock: DeepMockProxy<ConnectPortfolioSummaryCentralDbRepositoryService> =
    mockDeep<ConnectPortfolioSummaryCentralDbRepositoryService>();
  const legalDocumentsServiceMock: DeepMockProxy<LegalDocumentsServiceBase> =
    mockDeep<LegalDocumentsServiceBase>();
  const tenantServiceMock: DeepMockProxy<TenantServiceBase> =
    mockDeep<TenantServiceBase>();
  const tenantBrandingServiceMock: DeepMockProxy<TenantBrandingServiceBase> =
    mockDeep<TenantBrandingServiceBase>();
  const RiskProfilingDomainServiceMock: DeepMockProxy<RiskProfilingDomainServiceBase> =
    mockDeep<RiskProfilingDomainServiceBase>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: keycloakFusionAuthSwitchoverConfigMock,
        },
        {
          provide: ConnectAdvisorServiceBase,
          useValue: connectAdvisorServiceMock,
        },
        {
          provide: ConnectTenantGoalTypeCentralDbRepositoryService,
          useValue: connectTenantGoalTypeCentralDbRepositoryMock,
        },
        {
          provide: ConnectPortfolioSummaryCentralDbRepositoryService,
          useValue: connectPortfolioSummaryCentralDbRepositoryMock,
        },
        {
          provide: LegalDocumentsServiceBase,
          useValue: legalDocumentsServiceMock,
        },
        {
          provide: TenantServiceBase,
          useValue: tenantServiceMock,
        },
        {
          provide: TenantBrandingServiceBase,
          useValue: tenantBrandingServiceMock,
        },
        {
          provide: ConnectAdvisorController,
          useClass: ConnectAdvisorController,
        },
        {
          provide: RiskProfilingDomainServiceBase,
          useValue: RiskProfilingDomainServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ConnectAdvisorController>(ConnectAdvisorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Leads Functionality', () => {
    it('should have a get leads function request api payload with a default sort value', async () => {
      const dto = new Dto.ConnectAdvisorLeadsRequestDto();

      expect(dto.sortOrder).not.toBeNull();
      expect(dto.sortOrder).not.toBeUndefined();
      expect(Array.isArray(dto.sortOrder)).toBeTruthy();
      expect(Array.isArray(dto.sortOrder)).toEqual(true);
      expect(dto.sortOrder.length).toEqual(1);

      const defaultSortValue = dto.sortOrder[0];

      expect(defaultSortValue).not.toBeNull();
      expect(defaultSortValue).not.toBeUndefined();
      expect(defaultSortValue.sortOrder).toEqual(
        SharedEnums.EnumSortOrder.DESC
      );
      expect(defaultSortValue.sortOrder).toEqual('desc');
      expect(defaultSortValue.columnName).toEqual('updatedAt');
    });
  });
});
