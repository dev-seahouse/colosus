// noinspection ES6PreferShortImport

process.env.STRIPE_SECRET_KEY = 'STRIPE_SECRET_KEY';
process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET = 'STRIPE_WEBHOOK_ENDPOINT_SECRET';

import {
  AuthenticationServiceBase,
  IamAdminServiceBase,
  RiskProfilingDomainServiceBase,
  TenantBrandingServiceBase,
  TenantServiceBase,
} from '@bambu/server-core/domains';
import {
  BlobRepositoryServiceBase,
  CacheManagerRepositoryServiceBase,
  ConnectAdvisorCentralDbRepositoryService,
  ConnectAdvisorPreferencesCentralDbRepositoryServiceBase,
  ConnectPortfolioSummaryCentralDbRepositoryService,
  ConnectTenantCentralDbRepositoryService,
  ConnectTenantGoalTypeCentralDbRepositoryService,
  GoalTypeCentralDbRepositoryService,
  InvestorCentralDbRepositoryServiceBase,
  LeadsCentralDbRepositoryService,
  RiskProfilingCentralDbService,
  TenantCentralDbRepositoryService,
  UserCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import { BambuEventEmitterService } from '@bambu/server-core/utilities';
import { ConnectLeadsDto, OtpDto, SharedEnums } from '@bambu/shared';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import * as _ from 'lodash';
import { ConnectToolsServiceBase } from '../tools';
import { ConnectAdvisorService } from './connect-advisor.service';
import {
  ConnectAdvisorServiceBase,
  GenerateValueForSummaryObjectNumberRulesParamsDto,
  IGenerateValueForSummaryObjectNumberRulesParamsDto,
} from './connect-advisor.service.base';

// Note(johannes): Priority: functions involving tenant name inference

describe('ConnectAdvisorService', () => {
  let service: ConnectAdvisorServiceBase;
  // let connectAdvisorPreferencesCentralDb: ConnectAdvisorPreferencesCentralDbRepositoryServiceBase;

  const configServiceMock: DeepMockProxy<ConfigService> =
    mockDeep<ConfigService>();
  const connectAdvisorCentralDbMock: DeepMockProxy<ConnectAdvisorCentralDbRepositoryService> =
    mockDeep<ConnectAdvisorCentralDbRepositoryService>();
  const connectPortfolioSummaryCentralDbRepositoryServiceMock: DeepMockProxy<ConnectPortfolioSummaryCentralDbRepositoryService> =
    mockDeep<ConnectPortfolioSummaryCentralDbRepositoryService>();
  const goalTypeCentralDbRepositoryServiceMock: DeepMockProxy<GoalTypeCentralDbRepositoryService> =
    mockDeep<GoalTypeCentralDbRepositoryService>();
  const connectTenantGoalTypeCentralDbRepositoryServiceMock: DeepMockProxy<ConnectTenantGoalTypeCentralDbRepositoryService> =
    mockDeep<ConnectTenantGoalTypeCentralDbRepositoryService>();
  const tenantCentralDbRepositoryServiceMock: DeepMockProxy<TenantCentralDbRepositoryService> =
    mockDeep<TenantCentralDbRepositoryService>();
  const tenantServiceBaseMock: DeepMockProxy<TenantServiceBase> =
    mockDeep<TenantServiceBase>();
  const authenticationServiceBaseMock: DeepMockProxy<AuthenticationServiceBase> =
    mockDeep<AuthenticationServiceBase>();
  const connectToolsServiceBaseMock: DeepMockProxy<ConnectToolsServiceBase> =
    mockDeep<ConnectToolsServiceBase>();
  const iamAdminServiceBaseMock: DeepMockProxy<IamAdminServiceBase> =
    mockDeep<IamAdminServiceBase>();
  const tenantBrandingServiceBaseMock: DeepMockProxy<TenantBrandingServiceBase> =
    mockDeep<TenantBrandingServiceBase>();
  const cacheManagerRepositoryServiceBaseMock: DeepMockProxy<CacheManagerRepositoryServiceBase> =
    mockDeep<CacheManagerRepositoryServiceBase>();
  const connectTenantCentralDbRepositoryServiceMock: DeepMockProxy<ConnectTenantCentralDbRepositoryService> =
    mockDeep<ConnectTenantCentralDbRepositoryService>();
  const blobRepositoryServiceBaseMock: DeepMockProxy<BlobRepositoryServiceBase> =
    mockDeep<BlobRepositoryServiceBase>();
  const bambuEventEmitterService: DeepMockProxy<BambuEventEmitterService> =
    mockDeep<BambuEventEmitterService>();
  const connectAdvisorPreferencesCentralDbRepositoryServiceBaseMock: DeepMockProxy<ConnectAdvisorPreferencesCentralDbRepositoryServiceBase> =
    mockDeep<ConnectAdvisorPreferencesCentralDbRepositoryServiceBase>();
  const userCentralDbRepositoryServiceMock: DeepMockProxy<UserCentralDbRepositoryService> =
    mockDeep<UserCentralDbRepositoryService>();
  const leadsCentralDbMock: DeepMockProxy<LeadsCentralDbRepositoryService> =
    mockDeep<LeadsCentralDbRepositoryService>();
  const riskProfilingDomainServiceMock: DeepMockProxy<RiskProfilingDomainServiceBase> =
    mockDeep<RiskProfilingDomainServiceBase>();
  const riskProfilingCentralDbServiceMock: DeepMockProxy<RiskProfilingCentralDbService> =
    mockDeep<RiskProfilingCentralDbService>();
  const investorCentralDbRepositoryServiceBaseMock: DeepMockProxy<InvestorCentralDbRepositoryServiceBase> =
    mockDeep<InvestorCentralDbRepositoryServiceBase>();

  beforeEach(async () => {
    mockReset(configServiceMock);
    mockReset(connectAdvisorCentralDbMock);
    mockReset(connectPortfolioSummaryCentralDbRepositoryServiceMock);
    mockReset(goalTypeCentralDbRepositoryServiceMock);
    mockReset(connectTenantGoalTypeCentralDbRepositoryServiceMock);
    mockReset(tenantCentralDbRepositoryServiceMock);
    mockReset(tenantServiceBaseMock);
    mockReset(authenticationServiceBaseMock);
    mockReset(connectToolsServiceBaseMock);
    mockReset(iamAdminServiceBaseMock);
    mockReset(tenantBrandingServiceBaseMock);
    mockReset(cacheManagerRepositoryServiceBaseMock);
    mockReset(connectTenantCentralDbRepositoryServiceMock);
    mockReset(blobRepositoryServiceBaseMock);
    mockReset(bambuEventEmitterService);
    mockReset(connectAdvisorPreferencesCentralDbRepositoryServiceBaseMock);
    mockReset(userCentralDbRepositoryServiceMock);
    mockReset(leadsCentralDbMock);
    mockReset(riskProfilingDomainServiceMock);
    mockReset(riskProfilingCentralDbServiceMock);
    mockReset(investorCentralDbRepositoryServiceBaseMock);

    configServiceMock.getOrThrow.mockReturnValue({
      // TODO
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: ConnectAdvisorCentralDbRepositoryService,
          useValue: connectAdvisorCentralDbMock,
        },
        {
          provide: ConnectPortfolioSummaryCentralDbRepositoryService,
          useValue: connectPortfolioSummaryCentralDbRepositoryServiceMock,
        },
        {
          provide: GoalTypeCentralDbRepositoryService,
          useValue: goalTypeCentralDbRepositoryServiceMock,
        },

        {
          provide: ConnectTenantGoalTypeCentralDbRepositoryService,
          useValue: connectTenantGoalTypeCentralDbRepositoryServiceMock,
        },
        {
          provide: TenantCentralDbRepositoryService,
          useValue: tenantCentralDbRepositoryServiceMock,
        },
        {
          provide: TenantServiceBase,
          useValue: tenantServiceBaseMock,
        },
        {
          provide: AuthenticationServiceBase,
          useValue: authenticationServiceBaseMock,
        },
        {
          provide: ConnectToolsServiceBase,
          useValue: connectToolsServiceBaseMock,
        },
        {
          provide: IamAdminServiceBase,
          useValue: iamAdminServiceBaseMock,
        },
        {
          provide: TenantBrandingServiceBase,
          useValue: tenantBrandingServiceBaseMock,
        },
        {
          provide: CacheManagerRepositoryServiceBase,
          useValue: cacheManagerRepositoryServiceBaseMock,
        },
        {
          provide: ConnectTenantCentralDbRepositoryService,
          useValue: connectTenantCentralDbRepositoryServiceMock,
        },
        {
          provide: BlobRepositoryServiceBase,
          useValue: blobRepositoryServiceBaseMock,
        },
        {
          provide: BambuEventEmitterService,
          useValue: bambuEventEmitterService,
        },
        {
          provide: ConnectAdvisorPreferencesCentralDbRepositoryServiceBase,
          useValue: connectAdvisorPreferencesCentralDbRepositoryServiceBaseMock,
        },
        {
          provide: UserCentralDbRepositoryService,
          useValue: userCentralDbRepositoryServiceMock,
        },
        {
          provide: LeadsCentralDbRepositoryService,
          useValue: leadsCentralDbMock,
        },
        {
          provide: ConnectAdvisorServiceBase,
          useClass: ConnectAdvisorService,
        },
        {
          provide: RiskProfilingDomainServiceBase,
          useValue: riskProfilingDomainServiceMock,
        },
        {
          provide: RiskProfilingCentralDbService,
          useValue: riskProfilingCentralDbServiceMock,
        },
        {
          provide: InvestorCentralDbRepositoryServiceBase,
          useValue: investorCentralDbRepositoryServiceBaseMock,
        },
      ],
    }).compile();

    service = module.get<ConnectAdvisorServiceBase>(ConnectAdvisorServiceBase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Advisor Preferences', () => {
    it('should have the GetConnectAdvisorPreferences method defined', () => {
      expect(service.GetConnectAdvisorPreferences).toBeDefined();
    });

    it('should return a value if preferences are available', async () => {
      jest.clearAllMocks();
      connectAdvisorPreferencesCentralDbRepositoryServiceBaseMock.GetConnectAdvisorPreferences.mockResolvedValue(
        {
          id: 'id',
          tenantId: 'tenantId',
          userId: 'userId',
          minimumAnnualIncomeThreshold: 0,
          minimumRetirementSavingsThreshold: 0,
        }
      );

      const result = await service.GetConnectAdvisorPreferences(
        'requestId',
        'tenantId',
        'advisorId'
      );
      expect(result).not.toBeNull();
    });

    it('should return null if preferences are not available', async () => {
      jest.clearAllMocks();
      connectAdvisorPreferencesCentralDbRepositoryServiceBaseMock.GetConnectAdvisorPreferences.mockResolvedValue(
        null
      );

      const result = await service.GetConnectAdvisorPreferences(
        'requestId',
        'tenantId',
        'advisorId'
      );
      expect(result).toBeNull();
    });

    it('should have the UpdateConnectAdvisorPreferences method', () => {
      expect(service.UpdateConnectAdvisorPreferences).toBeDefined();
    });

    it('should return updated value if values are viable', async () => {
      const submittedValue = {
        tenantId: 'tenantId',
        userId: 'userId',
        minimumAnnualIncomeThreshold: 10,
        minimumRetirementSavingsThreshold: 10,
      };

      const responseValue = {
        ...submittedValue,
        id: 'id',
      };

      jest
        .spyOn(
          connectAdvisorPreferencesCentralDbRepositoryServiceBaseMock,
          'UpsertConnectAdvisorPreferences'
        )
        .mockResolvedValue(responseValue);

      const result = await service.UpdateConnectAdvisorPreferences(
        'requestId',
        submittedValue
      );

      const clonedResponseValue = _.cloneDeep(result);
      delete clonedResponseValue.id;

      expect(clonedResponseValue).toStrictEqual(submittedValue);
    });

    it('should throw an error if minimumRetirementSavingsThreshold or minimumAnnualIncomeThreshold is less than zero', async () => {
      await expect(
        service.UpdateConnectAdvisorPreferences('requestId', {
          tenantId: 'tenantId',
          userId: 'userId',
          minimumAnnualIncomeThreshold: -1,
          minimumRetirementSavingsThreshold: -1,
        })
      ).rejects.toThrowError();

      await expect(
        service.UpdateConnectAdvisorPreferences('requestId', {
          tenantId: 'tenantId',
          userId: 'userId',
          minimumAnnualIncomeThreshold: 0,
          minimumRetirementSavingsThreshold: -1,
        })
      ).rejects.toThrowError();

      await expect(
        service.UpdateConnectAdvisorPreferences('requestId', {
          tenantId: 'tenantId',
          userId: 'userId',
          minimumAnnualIncomeThreshold: 1,
          minimumRetirementSavingsThreshold: -1,
        })
      ).rejects.toThrowError();

      await expect(
        service.UpdateConnectAdvisorPreferences('requestId', {
          tenantId: 'tenantId',
          userId: 'userId',
          minimumAnnualIncomeThreshold: -1,
          minimumRetirementSavingsThreshold: 0,
        })
      ).rejects.toThrowError();

      await expect(
        service.UpdateConnectAdvisorPreferences('requestId', {
          tenantId: 'tenantId',
          userId: 'userId',
          minimumAnnualIncomeThreshold: -1,
          minimumRetirementSavingsThreshold: 1,
        })
      ).rejects.toThrowError();
    });
  });

  describe('The Advisor Leads By Id operations', () => {
    it('should have the GetLeadById method defined', () => {
      expect(service.GetLeadById).toBeDefined();
    });

    it('should return a value if lead is available', async () => {
      jest.clearAllMocks();

      const tenantId = 'tenantId';

      tenantServiceBaseMock.GetTenantFromTenantNameSafe.mockResolvedValue({
        id: tenantId,
        updatedAt: new Date(),
        usesIdInsteadOfRealm: false,
        createdAt: new Date(),
        linkedToKeyCloak: false,
        realm: 'realm',
        createdBy: 'createdBy',
        updatedBy: 'updatedBy',
        tenantSubscriptions: [],
        apiKeys: [],
        httpUrls: [],
        linkedToFusionAuth: false,
      });

      const defaultLead: ConnectLeadsDto.IConnectLeadsAdvisorDto = {
        id: 'f54eab5d-84e6-4038-8887-8961d4f2ef17',
        tenantId: '54e7f125-5979-4a7b-9d3f-aa37f4bcf25b',
        name: 'test',
        email: 'ostin+12@bambu.co',
        phoneNumber: '',
        zipCode: '12345',
        age: 30,
        incomePerAnnum: 30000,
        currentSavings: 0,
        isRetired: false,
        goalDescription: 'Buy a house',
        goalName: 'House',
        goalValue: 2469,
        goalTimeframe: 5,
        riskAppetite: '57380a6e-ec8e-431a-a600-4437eebfe464',
        notes: '',
        createdBy: 'COLOSSUS',
        createdAt: '2023-05-15 02:20:35.570',
        updatedBy: 'COLOSSUS',
        updatedAt: '2023-05-15 02:21:06.803',
        initialInvestment: 0.0,
        monthlyContribution: 40.0,
        projectedReturns: { low: 2544.16, high: 2625.22, target: 2556.24 },
        sendAppointmentEmail: false,
        sendGoalProjectionEmail: false,
        status: SharedEnums.LeadsEnums.EnumLeadStatus.NEW,
        monthlySavings: 0,
      };

      const leadId = defaultLead.id;

      leadsCentralDbMock.GetLeadById.mockResolvedValue(defaultLead);

      const lead = service.GetLeadById(`requestId`, {
        tenantId: 'tenantId',
        id: leadId,
      });

      expect(lead).not.toBeNull();
    });
  });

  describe('Profile Picture Functions', () => {
    describe('SetInternalProfilePicture', () => {
      it('should be defined', () => {
        expect(service.SetInternalProfilePicture).toBeDefined();
      });
      // TODO
    });
    describe('UnsetInternalProfilePicture', () => {
      it('should be defined', () => {
        expect(service.UnsetInternalProfilePicture).toBeDefined();
      });
      // TODO
    });
    describe('SetProfilePicture', () => {
      it('should be defined', () => {
        expect(service.SetProfilePicture).toBeDefined();
      });
      // TODO
    });
    describe('UnsetProfilePicture', () => {
      it('should be defined', () => {
        expect(service.UnsetProfilePicture).toBeDefined();
      });
      // TODO
    });
  });

  describe('Branding and URL/Domain/Subdomain Functions', () => {
    describe('GetTradeNameAndSubdomain', () => {
      it('should be defined', () => {
        expect(service.GetTradeNameAndSubdomain).toBeDefined();
      });
      // TODO
    });
    describe('SetTradeNameAndSubdomain', () => {
      it('should be defined', () => {
        expect(service.SetTradeNameAndSubdomain).toBeDefined();
      });
      // TODO
    });
  });

  describe('Advisor Profile Functions', () => {
    describe('UpdateProfile', () => {
      it('should be defined', () => {
        expect(service.UpdateProfile).toBeDefined();
      });
      // TODO
    });
    describe('GetProfile', () => {
      it('should be defined', () => {
        expect(service.GetProfile).toBeDefined();
      });
      // TODO
    });
    describe('SetProfileBio', () => {
      it('should be defined', () => {
        expect(service.SetProfileBio).toBeDefined();
      });
      // TODO
    });
    describe('SetContactData', () => {
      it('should be defined', () => {
        expect.assertions(1);
        expect(service.SetContactData).toBeDefined();
      });
      it('should call necessary underlying services upon valid input', async () => {
        expect.assertions(1);
        const payload = {
          userId: 'userId',
          tenantRealm: 'tenantRealm',
          contactMeReasonsRichText: 'contactMeReasonsRichText',
          contactLink: 'contactLink',
        };
        connectAdvisorCentralDbMock.FindAdvisor.mockResolvedValue({
          userId: 'userId', // same as user id
          tenantId: 'tenantId', // DB ID of the tenant record. NOT the tenantRealm (tenantRealm is sometimes known as realm or realmId)
          firstName: 'firstName',
          lastName: 'lastName',
          jobTitle: 'jobTitle',
          countryOfResidence: 'USA', // ISO 3166-1 alpha-3 (three-letter country codes)
          businessName: 'businessName',
          Tenant: {
            id: 'id',
            realm: 'realm',
            linkedToKeyCloak: false,
            linkedToFusionAuth: true,
            usesIdInsteadOfRealm: true,
            createdAt: new Date(),
            createdBy: 'createdBy',
            updatedAt: new Date(),
            updatedBy: 'updatedBy',
          },
        });
        await service.SetContactData(payload, {
          requestId: 'requestId',
        });
        expect(connectAdvisorCentralDbMock.UpsertAdvisor).lastCalledWith(
          payload
        );
      });
      // TODO
    });
  });

  describe('Credentials and Authorization Functions', () => {
    describe('ChangePasswordByEmailOtp', () => {
      it('should be defined', () => {
        expect(service.ChangePasswordByEmailOtp).toBeDefined();
      });
      // TODO
    });
    describe('VerifyUserEmailByEmailOtp', () => {
      it('should be defined', () => {
        expect(service.VerifyUserEmailByEmailOtp).toBeDefined();
      });
      // TODO
    });
    describe('SendChangePasswordEmailLink', () => {
      it('should be defined', () => {
        expect(service.SendChangePasswordEmailLink).toBeDefined();
      });
      // TODO
    });
    describe('ResendTenantOtp', () => {
      it('should be defined', () => {
        expect(service.ResendTenantOtp).toBeDefined();
      });
      // TODO
    });
    describe('Login', () => {
      it('should be defined', () => {
        expect(service.Login).toBeDefined();
      });
      // TODO
    });
  });

  describe('Initial Advisor Setup Functions', () => {
    describe('CreateAdvisorTenantWithInitialUserViaFusionAuth', () => {
      it('should be defined', () => {
        expect(
          service.CreateAdvisorTenantWithInitialUserViaFusionAuth
        ).toBeDefined();
      });

      it('should throw an error if a tenant already exists with that email, according to tenant service', async () => {
        expect.assertions(1);
        tenantServiceBaseMock.GuardAgainstTenantCreationWithExistingUser.mockRejectedValue(
          'Tenant already exists with that email'
        );
        await expect(
          service.CreateAdvisorTenantWithInitialUserViaFusionAuth(
            {
              requestId: 'requestId',
            },
            {
              username: 'foo@eggs.com',
              password: 'password',
              enableMarketing: false,
            }
          )
        ).rejects.toEqual('Tenant already exists with that email');
      });

      describe('when given suitable parameters and a suitable state (happy flow)', () => {
        beforeEach(() => {
          tenantServiceBaseMock.GuardAgainstTenantCreationWithExistingUser.mockResolvedValue();

          connectToolsServiceBaseMock.PredictTenantNameFromAdvisorUsername.mockResolvedValue(
            'tenantName'
          );

          tenantServiceBaseMock.CreateTenantViaFusionAuth.mockResolvedValue(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Promise.resolve<any>({})
          );

          tenantServiceBaseMock.CreateTenantApplicationForFusionAuthWithDefaultGroups.mockImplementation(
            async ({ tenantId, applicationId, applicationName, tracking }) => {
              return {
                iamServiceTenantApplication: {
                  application: {
                    id: 'applicationId',
                  },
                },
                iamApplicationSingletonGroups: [
                  { group: { id: 'ggrouupp1' } },
                  {
                    group: {
                      id: 'ggrouupp2',
                      tenantId,
                      roles: {
                        [applicationId]: [
                          {
                            name: 'Vendee-Admin',
                          },
                        ],
                      },
                    },
                  },
                  {
                    group: {
                      id: 'ggrouupp3',
                      tenantId,
                      roles: {
                        [applicationId]: [
                          {
                            name: 'Investor',
                          },
                        ],
                      },
                    },
                  },
                ],
              };
            }
          );

          tenantServiceBaseMock.CreateInitialTenantUserForFusionAuth.mockResolvedValue(
            {
              dbUser: {
                id: 'id',
                tenantId: 'tenantId',
              },
              iamTenantAdminUser: {},
            }
          );

          tenantServiceBaseMock.SendOtpForInitialVerification.mockResolvedValue();

          connectPortfolioSummaryCentralDbRepositoryServiceMock.InitializeTenantPortfolioSummaries.mockResolvedValue();

          tenantBrandingServiceBaseMock.InitializeBranding.mockResolvedValue();

          tenantCentralDbRepositoryServiceMock.InitializeConnectTenant.mockResolvedValue();

          goalTypeCentralDbRepositoryServiceMock.GetAll.mockResolvedValue([
            {
              id: 'id1',
              name: 'name1',
              description: 'description1',
              sortKey: 1,
            },
            {
              id: 'id2',
              name: 'name2',
              description: 'description2',
              sortKey: 2,
            },
          ]);

          // Note: !UuidUtils.isStringUuid(realmName) happens right before this step
          //   consider checking that area if tests fail to run
          tenantCentralDbRepositoryServiceMock.FindTenantById.mockResolvedValue(
            {
              id: 'id',
              realm: 'realm',
              linkedToKeyCloak: false,
              linkedToFusionAuth: true,
              usesIdInsteadOfRealm: true,
              createdAt: new Date(),
              createdBy: 'createdBy',
              updatedAt: new Date(),
              updatedBy: 'updatedBy',
              apiKeys: [],
              httpUrls: [],
              branding: {
                id: 'brandingId',
                tenantId: 'tenantId',
                branding: {},
                createdAt: new Date(),
                createdBy: 'createdBy',
                updatedAt: new Date(),
                updatedBy: 'updatedBy',
              },
              connectAdvisors: [],
              tenantSubscriptions: [],
            }
          );

          tenantCentralDbRepositoryServiceMock.FindTenantByRealm.mockResolvedValue(
            {
              id: 'id',
              realm: 'realm',
              linkedToKeyCloak: false,
              linkedToFusionAuth: true,
              usesIdInsteadOfRealm: true,
              createdAt: new Date(),
              createdBy: 'createdBy',
              updatedAt: new Date(),
              updatedBy: 'updatedBy',
              apiKeys: [],
              httpUrls: [],
              branding: {
                id: 'brandingId',
                tenantId: 'tenantId',
                branding: {},
                createdAt: new Date(),
                createdBy: 'createdBy',
                updatedAt: new Date(),
                updatedBy: 'updatedBy',
              },
              connectAdvisors: [],
              tenantSubscriptions: [],
            }
          );

          connectTenantCentralDbRepositoryServiceMock.UpdateConnectTenantSetupState.mockResolvedValue();

          tenantServiceBaseMock.SetupHubSpotForNewTenant.mockResolvedValue();

          // TODO: mock user calls

          authenticationServiceBaseMock.Login.mockResolvedValue({
            access_token: 'access_token',
            expires_in: 1000,
            refresh_expires_in: 10000,
            refresh_token: 'refresh_token',
            token_type: 'token_type',
            'not-before-policy': 100,
            session_state: 'session_state',
          });
        });

        it('should delegate creating a tenant to the tenant service', async () => {
          expect.assertions(2);
          await service.CreateAdvisorTenantWithInitialUserViaFusionAuth(
            {
              requestId: 'requestId',
            },
            {
              username: 'foo@eggs.com',
              password: 'password',
              enableMarketing: false,
            }
          );
          expect(
            tenantServiceBaseMock.CreateTenantViaFusionAuth
          ).toBeCalledTimes(1);
          expect(
            tenantServiceBaseMock.CreateTenantViaFusionAuth
          ).lastCalledWith(
            expect.anything(),
            'tenantName', // TODO: needs to be refactored away
            expect.any(String)
          );
        });
        it('should then create two applications (by delegating to tenant service) on that tenant, alongside groups specific to that application', async () => {
          expect.assertions(3);
          await service.CreateAdvisorTenantWithInitialUserViaFusionAuth(
            {
              requestId: 'requestId',
            },
            {
              username: 'foo@eggs.com',
              password: 'password',
              enableMarketing: false,
            }
          );
          expect(
            tenantServiceBaseMock.CreateTenantApplicationForFusionAuthWithDefaultGroups
          ).toBeCalledTimes(2);
          expect(
            tenantServiceBaseMock.CreateTenantApplicationForFusionAuthWithDefaultGroups
          ).nthCalledWith(
            1,
            expect.objectContaining({
              tenantId: expect.any(String),
              applicationId: expect.any(String),
              applicationName: expect.stringContaining('bambu-go-connect-'),
              tracking: expect.anything(),
            })
          );
          expect(
            tenantServiceBaseMock.CreateTenantApplicationForFusionAuthWithDefaultGroups
          ).nthCalledWith(
            2,
            expect.objectContaining({
              tenantId: expect.any(String),
              applicationId: expect.any(String),
              applicationName: expect.stringContaining('bambu-go-transact-'),
              tracking: expect.anything(),
            })
          );
        });
        it('should then create a single user (by delegating to tenant service) on that tenant, passing along said groups', async () => {
          expect.assertions(2);
          await service.CreateAdvisorTenantWithInitialUserViaFusionAuth(
            {
              requestId: 'requestId',
            },
            {
              username: 'foo@eggs.com',
              password: 'password',
              enableMarketing: false,
            }
          );
          expect(
            tenantServiceBaseMock.CreateInitialTenantUserForFusionAuth
          ).toBeCalledTimes(1);
          // groupMemberships in payload comes from tenantService.CreateTenantApplicationForFusionAuthWithDefaultGroups return value
          expect(
            tenantServiceBaseMock.CreateInitialTenantUserForFusionAuth
          ).lastCalledWith(
            expect.objectContaining({
              userId: expect.any(String),
              password: 'password',
              tenantId: expect.any(String),
              applicationId: expect.any(String),
              groupMemberships: expect.arrayContaining(['ggrouupp2']),
              username: 'foo@eggs.com',
              email: 'foo@eggs.com',
              tracking: expect.anything(),
            })
          );
        });
        it('should send an OTP (by delegating to tenant service) asking the customer the tenant has been created to represent to verify their email', async () => {
          expect.assertions(2);
          await service.CreateAdvisorTenantWithInitialUserViaFusionAuth(
            {
              requestId: 'requestId',
            },
            {
              username: 'foo@eggs.com',
              password: 'password',
              enableMarketing: false,
            }
          );
          expect(
            tenantServiceBaseMock.SendOtpForInitialVerification
          ).toBeCalledTimes(1);
          expect(
            tenantServiceBaseMock.SendOtpForInitialVerification
          ).lastCalledWith(
            expect.objectContaining({
              tenantId: expect.any(String),
              requestId: 'requestId',
              email: 'foo@eggs.com',
              mode: OtpDto.EnumOtpMode.EMAIL,
            })
          );
        });
        it('should seed tenant goals', async () => {
          expect.assertions(2);
          await service.CreateAdvisorTenantWithInitialUserViaFusionAuth(
            {
              requestId: 'requestId',
            },
            {
              username: 'foo@eggs.com',
              password: 'password',
              enableMarketing: false,
            }
          );
          expect(
            connectTenantGoalTypeCentralDbRepositoryServiceMock.SetTenantGoalTypes
          ).toBeCalledTimes(1);
          expect(
            connectTenantGoalTypeCentralDbRepositoryServiceMock.SetTenantGoalTypes
          ).lastCalledWith('tenantName', ['id1', 'id2'], undefined);
        });
        it('should initialize other defaults (by delegating to various services) for the tenant', async () => {
          expect.assertions(7);
          await service.CreateAdvisorTenantWithInitialUserViaFusionAuth(
            {
              requestId: 'requestId',
            },
            {
              username: 'foo@eggs.com',
              password: 'password',
              enableMarketing: false,
            }
          );
          expect(
            connectPortfolioSummaryCentralDbRepositoryServiceMock.InitializeTenantPortfolioSummaries
          ).toBeCalledTimes(1);
          expect(
            connectPortfolioSummaryCentralDbRepositoryServiceMock.InitializeTenantPortfolioSummaries
          ).lastCalledWith(
            expect.objectContaining({
              // TODO: API due for refactor
              tenantRealm: 'tenantName',
            })
          );
          expect(
            tenantBrandingServiceBaseMock.InitializeBranding
          ).toBeCalledTimes(1);
          expect(
            tenantBrandingServiceBaseMock.InitializeBranding
          ).lastCalledWith(
            expect.objectContaining({
              tenantId: expect.any(String),
            })
          );
          expect(
            tenantCentralDbRepositoryServiceMock.InitializeConnectTenant
          ).toBeCalledTimes(1);
          expect(
            tenantCentralDbRepositoryServiceMock.InitializeConnectTenant
          ).lastCalledWith(
            expect.objectContaining({
              tenantId: expect.any(String),
            })
          );
          expect(
            tenantServiceBaseMock.SetupHubSpotForNewTenant
          ).toBeCalledTimes(1);
        });
        it('should return a login response (incl. access token, refresh token, etc.) for the user', async () => {
          const res =
            await service.CreateAdvisorTenantWithInitialUserViaFusionAuth(
              {
                requestId: 'requestId',
              },
              {
                username: 'foo@eggs.com',
                password: 'password',
                enableMarketing: false,
              }
            );
          expect(authenticationServiceBaseMock.Login).toBeCalledTimes(1);
          expect(authenticationServiceBaseMock.Login).lastCalledWith(
            'requestId',
            {
              realmId: expect.any(String),
              password: 'password',
              username: 'foo@eggs.com',
              applicationId: 'applicationId',
            }
          );
          expect(res).toStrictEqual(
            expect.objectContaining({
              access_token: 'access_token',
              expires_in: 1000,
              refresh_expires_in: 10000,
              refresh_token: 'refresh_token',
              token_type: 'token_type',
              'not-before-policy': 100,
              session_state: 'session_state',
            })
          );
        });
      });
    });
    describe.skip('Create', () => {
      it('should be defined', () => {
        expect(service.Create).toBeDefined();
      });
      // TODO
    });
  });

  describe('Goal Type Functions', () => {
    describe('SetGoalTypes', () => {
      it('should be defined', () => {
        expect(service.SetGoalTypes).toBeDefined();
      });
      // TODO
    });
  });

  describe('Technical Functions', () => {
    describe('FlushInvestorPortalCachedHtml', () => {
      // Note: no tests, as this is a good candidate for being refactored out
      // TODO
    });
  });

  describe('Lead Threshold and Preferences Functions', () => {
    describe('GetTenantTopLevelOptions', () => {
      it('should be defined', () => {
        expect(service.GetTenantTopLevelOptions).toBeDefined();
      });
      // TODO
    });
    describe('SetTenantTopLevelOptions', () => {
      it('should be defined', () => {
        expect(service.SetTenantTopLevelOptions).toBeDefined();
      });
      // TODO
    });
  });

  describe('Portfolio Summary Setup Functions', () => {
    describe('SetConnectPortfolioSummary', () => {
      it('should be defined', () => {
        expect(service.SetConnectPortfolioSummary).toBeDefined();
      });
      // TODO
    });
  });

  // TODO: refactor existing tests into here
  describe('Advisor Preferences Functions', () => {
    describe('GetConnectAdvisorPreferences', () => {
      it('should be defined', () => {
        expect(service.GetConnectAdvisorPreferences).toBeDefined();
      });
      // TODO
    });
    describe('UpdateConnectAdvisorPreferences', () => {
      it('should be defined', () => {
        expect(service.UpdateConnectAdvisorPreferences).toBeDefined();
      });
      // TODO
    });
  });

  describe('Advisor Leads Functions', () => {
    describe('GetConnectLeads', () => {
      it('should be defined', () => {
        expect(service.GetConnectLeads).toBeDefined();
      });

      it('should have a function getLeadQualificationThresholds available', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((service as any).getLeadQualificationThresholds).toBeDefined();
      });

      it('should get a tuple of retireeSavingsThreshold and incomeThreshold from getLeadQualificationThresholds', async () => {
        const testResponsePayload = {
          retireeSavingsThreshold: 1000,
          incomeThreshold: 2000,
        };
        connectTenantCentralDbRepositoryServiceMock.GetConnectTenantByTenantId.mockResolvedValueOnce(
          {
            ...testResponsePayload,
            id: 'id',
            tenantId: 'tenantId',
            createdAt: new Date(),
            createdBy: 'createdBy',
            updatedAt: new Date(),
            updatedBy: 'updatedBy',
            contactLink: 'contactLink',
            setupState: {
              hasUpdatedBranding: false,
              hasUpdatedContent: false,
              hasUpdatedGoals: false,
              hasUpdatedLeadSettings: false,
              hasUpdatedPortfolios: false,
            },
          }
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (service as any).getLeadQualificationThresholds(
          'requestId',
          'tenantId'
        );

        expect(result).not.toBeNull();
        expect(result).toStrictEqual([
          testResponsePayload.retireeSavingsThreshold,
          testResponsePayload.incomeThreshold,
        ]);
      });

      it('should throw an error if Connect Tenant is not available', async () => {
        connectTenantCentralDbRepositoryServiceMock.GetConnectTenantByTenantId.mockResolvedValueOnce(
          null
        );

        await expect(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (service as any).getLeadQualificationThresholds(
            'requestId',
            'tenantId'
          )
        ).rejects.toThrowError(
          'Connect tenant not found for top level settings.'
        );
      });
    });

    describe('GetLeadById', () => {
      it('should be defined', () => {
        expect(service.GetLeadById).toBeDefined();
      });
      // TODO
    });
    describe('UpdateLeadById', () => {
      it('should be defined', () => {
        expect(service.UpdateLeadById).toBeDefined();
      });
      // TODO
    });
    describe('GetLeadSummaryById', () => {
      it('should be defined', () => {
        expect(service.GetLeadSummaryById).toBeDefined();
      });

      it('should throw an error if lead is not available', async () => {
        leadsCentralDbMock.GetLeadByIdForSummary.mockResolvedValueOnce(null);

        await expect(
          service.GetLeadSummaryById('requestId', {
            tenantId: 'tenantId',
            id: 'leadId',
          })
        ).rejects.toThrowError(`Lead not found.`);
      });

      const baseGetLeadIdForSummaryResponse = {
        age: 30,
        monthlySavings: null,
        createdAt: new Date(),
        createdBy: 'createdBy',
        updatedAt: new Date(),
        id: 'id',
        tenantId: 'tenantId',
        email: 'email',
        name: 'name',
        updatedBy: 'updatedBy',
        status: SharedEnums.LeadsEnums.EnumLeadStatus.NEW,
        goalDescription: 'goalDescription',
        goalName: 'goalName',
        goalTimeframe: 5,
        goalValue: 500,
        initialInvestment: 500,
        isRetired: false,
        monthlyContribution: 0,
        riskAppetite: '9394967',
        sendAppointmentEmail: true,
        sendGoalProjectionEmail: true,
        zipCode: 'W52ER',
        projectedReturns: {
          low: 0,
          high: 0,
          target: 0,
        },
        ConnectPortfolioSummary: {
          name: 'name',
          id: 'id',
          createdAt: new Date(),
          createdBy: 'createdBy',
          updatedAt: new Date(),
          updatedBy: 'updatedBy',
          description: 'description',
          tenantId: 'tenantId',
          assetClassAllocation: [],
          sortKey: 10,
          key: 'KEY',
          expectedReturnPercent: 0,
          expectedVolatilityPercent: 0,
          showSummaryStatistics: false,
          reviewed: true,
        },
      };

      it('should return a value if lead is available', async () => {
        const testResponsePayload = _.cloneDeep(
          baseGetLeadIdForSummaryResponse
        );
        leadsCentralDbMock.GetLeadByIdForSummary.mockResolvedValueOnce(
          testResponsePayload
        );

        const result = await service.GetLeadSummaryById('requestId', {
          tenantId: 'tenantId',
          id: 'leadId',
        });

        expect(result).not.toBeNull();
        expect(Array.isArray(result)).toBe(true);

        const targetObject = _.chain(result)
          .filter((x) => x.key === 'USER_DETAILS')
          .first()
          .value();
        expect(targetObject).not.toBeNull();
        expect(targetObject.fields.find((x) => x.key === 'NAME').value).toBe(
          testResponsePayload.name
        );
      });

      it('should have the field key RETIREMENT_SAVINGS if user is retired', async () => {
        const testResponsePayload = _.cloneDeep(
          baseGetLeadIdForSummaryResponse
        );
        testResponsePayload.isRetired = true;
        leadsCentralDbMock.GetLeadByIdForSummary.mockResolvedValueOnce(
          testResponsePayload
        );

        const result = await service.GetLeadSummaryById('requestId', {
          tenantId: 'tenantId',
          id: 'leadId',
        });

        expect(result).not.toBeNull();
        expect(Array.isArray(result)).toBe(true);

        const targetObject = _.chain(result)
          .filter((x) => x.key === 'PERSONAL_DETAILS')
          .first()
          .value();
        expect(targetObject).not.toBeNull();
        expect(
          targetObject.fields.find((x) => x.key === 'RETIREMENT_SAVINGS')
        ).toBeDefined();
      });

      it('should not have the field key RETIREMENT_SAVINGS if user is not retired and instead have ANNUAL_INCOME', async () => {
        const testResponsePayload = _.cloneDeep(
          baseGetLeadIdForSummaryResponse
        );
        testResponsePayload.isRetired = false;
        leadsCentralDbMock.GetLeadByIdForSummary.mockResolvedValueOnce(
          testResponsePayload
        );

        const result = await service.GetLeadSummaryById('requestId', {
          tenantId: 'tenantId',
          id: 'leadId',
        });

        expect(result).not.toBeNull();
        expect(Array.isArray(result)).toBe(true);

        const targetObject = _.chain(result)
          .filter((x) => x.key === 'PERSONAL_DETAILS')
          .first()
          .value();
        expect(targetObject).not.toBeNull();
        expect(
          targetObject.fields.find((x) => x.key === 'RETIREMENT_SAVINGS')
        ).not.toBeDefined();
        expect(
          targetObject.fields.find((x) => x.key === 'ANNUAL_INCOME')
        ).toBeDefined();
      });

      it('monthlySavings should return a "-" if the field is null', async () => {
        const testResponsePayload = _.cloneDeep(
          baseGetLeadIdForSummaryResponse
        );
        testResponsePayload.monthlySavings = null;
        leadsCentralDbMock.GetLeadByIdForSummary.mockResolvedValueOnce(
          testResponsePayload
        );

        const result = await service.GetLeadSummaryById('requestId', {
          tenantId: 'tenantId',
          id: 'leadId',
        });

        expect(result).not.toBeNull();
        expect(Array.isArray(result)).toBe(true);

        const targetObject = result.find((x) => x.key === 'PERSONAL_DETAILS');
        expect(targetObject).not.toBeNull();

        const monthlySavingsField = targetObject.fields.find(
          (x) => x.key === 'MONTHLY_SAVINGS'
        );
        expect(monthlySavingsField).not.toBeNull();
        expect(monthlySavingsField.value).toBe('-');
      });

      it('should always return investment style in sentence case', async () => {
        const investmentStyle = 'CONSERVATIVE';
        const investmentStyleSentenceCase = 'Conservative';

        const testResponsePayload = _.cloneDeep(
          baseGetLeadIdForSummaryResponse
        );
        testResponsePayload.ConnectPortfolioSummary.key = investmentStyle;

        leadsCentralDbMock.GetLeadByIdForSummary.mockResolvedValueOnce(
          testResponsePayload
        );

        const result = await service.GetLeadSummaryById('requestId', {
          tenantId: 'tenantId',
          id: 'leadId',
        });

        expect(result).not.toBeNull();
        expect(Array.isArray(result)).toBe(true);

        const targetObject = _.chain(result)
          .filter((x) => x.key === 'PERSONAL_DETAILS')
          .map((x) => x.fields)
          .flatten()
          .find((x) => x.key === 'INVESTMENT_STYLE')
          .value();

        expect(targetObject).not.toBeNull();
        expect(targetObject.value).toBe(investmentStyleSentenceCase);
      });

      describe('generateValueForSummaryObject', () => {
        it('should be defined', () => {
          expect.assertions(1);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expect((service as any).generateValueForSummaryObject).toBeDefined();
        });

        it('should return a default value of "-" value if the field is undefined or null', async () => {
          expect.assertions(4);
          const defaultValue = '-';

          const undefinedResult =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (service as any).generateValueForSummaryObject({
              value: undefined,
            });

          expect(undefinedResult).not.toBeNull();
          expect(undefinedResult).toBe(defaultValue);

          const nullResult =
            await // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (service as any).generateValueForSummaryObject({
              value: undefined,
            });

          expect(nullResult).not.toBeNull();
          expect(nullResult).toBe(defaultValue);
        });

        it('should return a value if the field is not null', async () => {
          expect.assertions(3);
          const defaultValue = '-';
          const value = 'bebola matius';

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result = await (service as any).generateValueForSummaryObject({
            value,
          });

          expect(result).not.toBeNull();
          expect(result).not.toBe(defaultValue);
          expect(result).toBe(value);
        });

        it('should be able to round off for numbers (123.456789 will be 123.46)', async () => {
          expect.assertions(3);
          const defaultValue = '-';
          const value = 123.456789;

          const numberRules: GenerateValueForSummaryObjectNumberRulesParamsDto =
            plainToInstance(GenerateValueForSummaryObjectNumberRulesParamsDto, {
              decimalPlaces: 2,
              roundOffNumbers: true,
            } as IGenerateValueForSummaryObjectNumberRulesParamsDto);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result = await (service as any).generateValueForSummaryObject({
            value,
            numberRules,
          });

          expect(result).not.toBeNull();
          expect(result).not.toBe(defaultValue);
          expect(result).toBe('123.46');
        });

        it('should reject a value if emptyValuePlaceholder is set to not a string', async () => {
          expect.assertions(1);
          const value = 123.456789;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const resultP = (service as any).generateValueForSummaryObject({
            value,
            emptyValuePlaceholder: 123,
          });

          expect(resultP).rejects.toBeTruthy();
        });

        it('should reject a value if numberRules is set to not an object', async () => {
          expect.assertions(1);
          const value = 123.456789;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const resultP = (service as any).generateValueForSummaryObject({
            value,
            numberRules: 123,
          });

          expect(resultP).rejects.toBeTruthy();
        });

        it('should reject if numberRules is given but does not have the shape of GenerateValueForSummaryObjectNumberRulesParamsDto', async () => {
          expect.assertions(1);
          const value = 123.456789;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const resultP = (service as any).generateValueForSummaryObject({
            value,
            numberRules: {
              roundOffNumbers: 450,
              decimalPlaces: 'bebola',
            },
          });

          expect(resultP).rejects.toBeTruthy();
        });
      });
    });
  });
});
