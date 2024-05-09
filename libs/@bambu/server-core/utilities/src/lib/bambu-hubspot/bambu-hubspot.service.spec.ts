import { Client } from '@hubspot/api-client';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { catchError, firstValueFrom, of } from 'rxjs';
import { BambuHubspotService } from './bambu-hubspot.service';
import {
  HubspotCreateContactPayload,
  HubspotSubscribePayload,
  HubspotUpdateContactPayload,
} from './types';
import { HubspotDealPayload } from './types/hubspot-deal-payload.type';
import { HubspotDealSearchPayload } from './types/hubspot-deal-search-payload.type';
import { HubspotDealUpdatePayload } from './types/hubspot-deal-update-payload.type';
import { HubspotDealUpdateWithContactPayload } from './types/hubspot-deal-update-with-contact-payload.type';
import { BambuEventEmitterServiceBase } from '../bambu-event-emitter/bambu-event-emitter-service.base';
import { SimplePublicObjectWithAssociations } from '@hubspot/api-client/lib/codegen/crm/contacts';
import {
  LabelsBetweenObjectPair,
  SimplePublicObject,
} from '@hubspot/api-client/lib/codegen/crm/deals';

// const HS_ACCESS_TOKEN = 'an access token';
// const HS_BASE_PATH = 'https://api.hubapi.com';
const HS_SUBSCRIPTION = '180551219';
const HS_DEAL_ID = '7291324407';

describe('BambuHubspotService', () => {
  let sut: BambuHubspotService;
  let mockHubspotClient: DeepMockProxy<Client>;
  let logger: Logger;

  beforeAll(async () => {
    const bambuEventEmitterService: DeepMockProxy<BambuEventEmitterServiceBase> =
      mockDeep<BambuEventEmitterServiceBase>();
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BambuHubspotService,
          useFactory: () => {
            logger = mockDeep<Logger>();
            return new BambuHubspotService(
              {
                accessToken: 'an access token',
                basePath: 'https://api.hubapi.com',
                hsSourceProperty: 'hs_persona',
                initialPipelineStepId: 'step 1',
                lostPipelineStepId: 'lost step',
                marketingSubscriptionId: 'subscription id',
                wonPipelineStepId: 'won step',
                pipelineID: 'default',
                isDisabled: false,
              },
              logger,
              bambuEventEmitterService
            );
          },
        },
      ],
    }).compile();

    sut = await moduleRef.get<BambuHubspotService>(BambuHubspotService);

    // Replace the hubspotClient with a mock
    mockHubspotClient = mockDeep<Client>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sut as any).hubspotClient = mockHubspotClient;
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('when calling getContact with an invalid email', () => {
    const initialPayload = 'unknown@unknown.com';

    beforeAll(async () => {
      jest.clearAllMocks();
      mockHubspotClient.crm.contacts.basicApi.getById.mockRejectedValueOnce({
        code: 404,
        body:
          '<html lang="en">\n' +
          '<head>\n' +
          '<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>\n' +
          '<title>Error 404 Not Found</title>\n' +
          '</head>\n' +
          '<body><h2>HTTP ERROR 404</h2>\n' +
          '<p>Resource not found</p>\n' +
          '</body>\n' +
          '</html>\n',
      });
    });

    it('should indicate that the contact was not found', async () => {
      const response = await firstValueFrom(
        sut.GetContact(initialPayload).pipe(
          catchError((err) => {
            return of(err);
          })
        )
      );

      expect(response).toStrictEqual({
        message:
          '<html lang="en">\n' +
          '<head>\n' +
          '<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>\n' +
          '<title>Error 404 Not Found</title>\n' +
          '</head>\n' +
          '<body><h2>HTTP ERROR 404</h2>\n' +
          '<p>Resource not found</p>\n' +
          '</body>\n' +
          '</html>\n',
        responseCode: 404,
        reason: 'HUBSPOT:404',
        isFormatted: true,
      });
    });
  });

  describe('when calling getContact with a valid email', () => {
    let result: SimplePublicObjectWithAssociations;
    const initialPayload = 'a_new_subscriber@somewhere.com';

    beforeAll(async () => {
      jest.clearAllMocks();
      mockHubspotClient.crm.contacts.basicApi.getById.mockResolvedValueOnce({
        id: '801',
        properties: {
          createdate: '2023-04-28T06:09:18.190Z',
          email: 'a_new_subscriber@somewhere.com',
          firstname: 'a_new_subscriber_first_name',
          hs_object_id: '801',
          lastmodifieddate: '2023-04-28T06:09:20.043Z',
          lastname: 'a_new_subscriber_last_name',
        },
        createdAt: new Date(1234567890),
        updatedAt: new Date(1234567890),
        archived: false,
      });

      result = await firstValueFrom(sut.GetContact(initialPayload));
    });

    it('should call the hubspot api with the appropriate details', () => {
      expect(mockHubspotClient.crm.contacts.basicApi.getById).toBeCalledWith(
        'a_new_subscriber@somewhere.com',
        undefined,
        undefined,
        undefined,
        false,
        'email'
      );
    });

    it('should respond with the contact information', async () => {
      expect(result).toEqual({
        id: '801',
        properties: {
          createdate: '2023-04-28T06:09:18.190Z',
          email: 'a_new_subscriber@somewhere.com',
          firstname: 'a_new_subscriber_first_name',
          hs_object_id: '801',
          lastmodifieddate: '2023-04-28T06:09:20.043Z',
          lastname: 'a_new_subscriber_last_name',
        },
        createdAt: new Date(1234567890),
        updatedAt: new Date(1234567890),
        archived: false,
      });
    });
  });

  describe('when calling createContact with a new contact', () => {
    let result: SimplePublicObjectWithAssociations;
    const initialPayload: HubspotCreateContactPayload = {
      email: 'test@bambu.co',
      source: 'unit test',
    };

    beforeAll(async () => {
      jest.clearAllMocks();
      mockHubspotClient.crm.contacts.basicApi.create.mockResolvedValueOnce({
        id: '751',
        properties: {
          createdate: '2023-04-28T05:09:25.444Z',
          email: initialPayload.email,
          hs_all_contact_vids: '751',
          hs_email_domain: 'litesolve.com',
          hs_is_contact: 'true',
          hs_is_unworked: 'true',
          hs_lifecyclestage_lead_date: '2023-04-28T05:09:25.444Z',
          hs_object_id: '751',
          hs_persona: 'unit test',
          hs_pipeline: 'contacts-lifecycle-pipeline',
          lastmodifieddate: '2023-04-28T05:09:25.444Z',
          lifecyclestage: 'lead',
        },
        createdAt: new Date(123457890),
        updatedAt: new Date(1234567890),
        archived: false,
      });

      result = await firstValueFrom(sut.CreateContact(initialPayload));
    });

    it('should call the hubspot api with the appropriate details', () => {
      expect(mockHubspotClient.crm.contacts.basicApi.create).toBeCalledWith({
        properties: {
          email: initialPayload.email,
          hs_persona: 'unit test',
        },
      });
    });

    it('should have a simple public object result', () => {
      expect(result).toStrictEqual({
        id: '751',
        properties: {
          createdate: '2023-04-28T05:09:25.444Z',
          email: initialPayload.email,
          hs_all_contact_vids: '751',
          hs_email_domain: 'litesolve.com',
          hs_is_contact: 'true',
          hs_is_unworked: 'true',
          hs_lifecyclestage_lead_date: '2023-04-28T05:09:25.444Z',
          hs_object_id: '751',
          hs_persona: 'unit test',
          hs_pipeline: 'contacts-lifecycle-pipeline',
          lastmodifieddate: '2023-04-28T05:09:25.444Z',
          lifecyclestage: 'lead',
        },
        archived: false,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });
  });

  describe('when calling createContact with an existing contact', () => {
    const initialPayload: HubspotCreateContactPayload = {
      email: 'ken+hs1@bambu.co',
      source: 'unit test',
    };

    beforeAll(async () => {
      jest.clearAllMocks();
      mockHubspotClient.crm.contacts.basicApi.create.mockRejectedValueOnce({
        code: 409,
        body: {
          status: 'error',
          message: 'Contact already exists. Existing ID: 751',
          correlationId: 'a7e0df34-953a-4066-97c8-2d45173aaa32',
          category: 'CONFLICT',
        },
      });
    });

    /**
     * Behavior here was changed to reflect the fact that we don't want to throw a 409 error anymore.
     * Instead, we want to return the existing contact.
     *
     * Needs further discussion with the boss man Ken McHugh.
     */
    it.skip('throw an error indicating the contact already exists', async () => {
      const response = await firstValueFrom(
        sut.CreateContact(initialPayload).pipe(
          catchError((err) => {
            return of(err);
          })
        )
      );

      expect(response).toStrictEqual({
        message: 'Contact already exists. Existing ID: 751',
        responseCode: 409,
        reason: 'HUBSPOT:CONFLICT',
        isFormatted: true,
      });
    });
  });

  describe('when calling updateContact with an existing contact', () => {
    let result: SimplePublicObjectWithAssociations;
    const contactEmail = 'test@bambu.co';

    const updatePayload: HubspotUpdateContactPayload = {
      firstname: 'Ken',
      lastname: 'McHugh',
      company: 'test company',
      jobtitle: 'test job title',
      phone: 'a phone number',
      country: undefined,
    };

    beforeAll(async () => {
      jest.clearAllMocks();
      mockHubspotClient.crm.contacts.basicApi.update.mockResolvedValueOnce({
        archived: false,
        createdAt: new Date(1234567890),
        id: '1301',
        properties: {
          company: 'test company',
          createdate: '2023-06-19T02:48:37.478Z',
          firstname: 'Ken',
          hs_is_unworked: 'true',
          hs_object_id: '1301',
          hs_pipeline: 'contacts-lifecycle-pipeline',
          jobtitle: 'test job title',
          lastmodifieddate: '2023-06-19T06:01:49.786Z',
          lastname: 'McHugh',
          lifecyclestage: 'lead',
          phone: 'a phone number',
        },
        updatedAt: new Date(1234567890),
      });
      result = await firstValueFrom(
        sut.UpdateContact(contactEmail, updatePayload)
      );
    });

    it('should call hubspot api update with the appropriate details', () => {
      const expectedPayload = {
        ...updatePayload,
      };
      delete expectedPayload.country;
      expect(mockHubspotClient.crm.contacts.basicApi.update).toBeCalledWith(
        contactEmail,
        {
          properties: expectedPayload,
        },
        'email'
      );
    });

    it('should have a simple public object result', () => {
      expect(result).toEqual({
        archived: false,
        createdAt: expect.anything(),
        id: '1301',
        properties: {
          company: 'test company',
          createdate: '2023-06-19T02:48:37.478Z',
          firstname: 'Ken',
          hs_is_unworked: 'true',
          hs_object_id: '1301',
          hs_pipeline: 'contacts-lifecycle-pipeline',
          jobtitle: 'test job title',
          lastmodifieddate: '2023-06-19T06:01:49.786Z',
          lastname: 'McHugh',
          lifecyclestage: 'lead',
          phone: 'a phone number',
        },
        updatedAt: expect.anything(),
      });
    });
  });

  describe('when calling updateContact with an invalid contact', () => {
    let errorResult: unknown;
    const contactEmail = 'an_invalid_contact@somewhere.com';
    const updatePayload: HubspotUpdateContactPayload = {
      firstname: 'any',
    };

    beforeAll(async () => {
      jest.clearAllMocks();
      mockHubspotClient.crm.contacts.basicApi.update.mockRejectedValueOnce({
        code: 404,
        body: {
          message: 'resource not found',
        },
      });

      await firstValueFrom(
        sut.UpdateContact(contactEmail, updatePayload)
      ).catch((err) => {
        errorResult = err;
      });
    });

    it('should call hubspot api update with the appropriate details', () => {
      expect(mockHubspotClient.crm.contacts.basicApi.update).toBeCalledWith(
        contactEmail,
        {
          properties: {
            firstname: 'any',
          },
        },
        'email'
      );
    });

    it('should respond with a not found error', () => {
      expect(errorResult).toStrictEqual({
        message: 'resource not found',
        responseCode: 404,
        reason: 'HUBSPOT:404',
        isFormatted: true,
      });
    });
  });

  describe('when calling subscribe with an invalid subscription', () => {
    const initialPayload: HubspotSubscribePayload = {
      email: 'a_new_subscriber@somewhere.com',
      subscriptionID: 'invalid',
      legalBasis: 'CONSENT_WITH_NOTICE',
      legalBasisExplanation: 'User Opted-in during registration',
      source: 'unit test',
    };

    beforeAll(async () => {
      jest.clearAllMocks();
      mockHubspotClient.crm.contacts.basicApi.create.mockResolvedValueOnce({
        properties: {
          email: 'someone@somewhere.com',
        },
        id: 'an id',
        createdAt: new Date(1234567890),
        updatedAt: new Date(1234567890),
      });

      mockHubspotClient.communicationPreferences.statusApi.subscribe.mockRejectedValueOnce(
        {
          code: 500,
          body: {
            status: 'error',
            message: 'internal error',
            correlationId: 'a7e0df34-953a-4066-97c8-2d45173aaa32',
          },
        }
      );
    });

    it('throw an error indicating the subscription failed', async () => {
      const response = await firstValueFrom(
        sut.Subscribe(initialPayload).pipe(
          catchError((err) => {
            return of(err);
          })
        )
      );

      expect(response).toStrictEqual({
        message: 'internal error',
        responseCode: 500,
        reason: 'HUBSPOT:500',
        isFormatted: true,
      });
    });
  });

  describe('when calling subscribe with an unsubscribed user', () => {
    let result: boolean;
    const initialPayload: HubspotSubscribePayload = {
      email: 'a_new_subscriber2@somewhere.com',
      subscriptionID: HS_SUBSCRIPTION,
      legalBasis: 'CONSENT_WITH_NOTICE',
      legalBasisExplanation: 'User Opted-in during registration',
      source: 'unit test',
    };

    beforeAll(async () => {
      jest.clearAllMocks();
      mockHubspotClient.crm.contacts.basicApi.create.mockResolvedValueOnce({
        properties: {
          email: 'someone@somewhere.com',
        },
        id: 'an id',
        createdAt: new Date(1234567890),
        updatedAt: new Date(1234567890),
      });

      mockHubspotClient.communicationPreferences.statusApi.subscribe.mockResolvedValueOnce(
        {
          id: 'a sub id',
          name: 'a sub name',
          description: 'a sub description',
          status: 'SUBSCRIBED',
          sourceOfStatus: 'SUBSCRIPTION_STATUS',
          brandId: undefined,
          preferenceGroupName: undefined,
          legalBasis: 'CONSENT_WITH_NOTICE',
          legalBasisExplanation: 'User Opted-in during registration',
        }
      );
      result = await firstValueFrom(sut.Subscribe(initialPayload));
    });

    it('should indicate the subscription has been successful', () => {
      expect(result).toBe(true);
    });

    it('should call the hubspot create contact api', () => {
      expect(mockHubspotClient.crm.contacts.basicApi.create).toBeCalledWith({
        properties: {
          email: initialPayload.email,
          hs_persona: 'unit test',
        },
      });
    });

    it('should call the hubspot subscribe api', () => {
      expect(
        mockHubspotClient.communicationPreferences.statusApi.subscribe
      ).toBeCalledWith({
        emailAddress: initialPayload.email,
        subscriptionId: initialPayload.subscriptionID,
        legalBasis: initialPayload.legalBasis,
        legalBasisExplanation: initialPayload.legalBasisExplanation,
      });
    });
  });

  describe('when calling subscribe with a subscribed user', () => {
    let result: boolean;
    const initialPayload: HubspotSubscribePayload = {
      email: 'a_new_subscriber2@somewhere.com',
      subscriptionID: HS_SUBSCRIPTION,
      legalBasis: 'CONSENT_WITH_NOTICE',
      legalBasisExplanation: 'User Opted-in during registration',
      source: 'unit test',
    };

    beforeAll(async () => {
      jest.clearAllMocks();
      mockHubspotClient.crm.contacts.basicApi.create.mockResolvedValueOnce({
        properties: {
          email: 'someone@somewhere.com',
        },
        id: 'an id',
        createdAt: new Date(1234567890),
        updatedAt: new Date(1234567890),
      });

      mockHubspotClient.communicationPreferences.statusApi.subscribe.mockRejectedValueOnce(
        {
          code: 400,
          body: {
            status: 'error',
            message:
              'a_new_subscriber2@somewhere.com is already subscribed to subscription 180551219',
            correlationId: 'a7e0df34-953a-4066-97c8-2d45173aaa32',
            category: 'VALIDATION_ERROR',
          },
        }
      );
      result = await firstValueFrom(sut.Subscribe(initialPayload));
    });

    it('should indicate the subscription has been successful', () => {
      expect(result).toBe(true);
    });

    it('should call the hubspot create contact api', () => {
      expect(mockHubspotClient.crm.contacts.basicApi.create).toBeCalledWith({
        properties: {
          email: initialPayload.email,
          hs_persona: 'unit test',
        },
      });
    });

    it('should call the hubspot subscribe api', () => {
      expect(
        mockHubspotClient.communicationPreferences.statusApi.subscribe
      ).toBeCalledWith({
        emailAddress: initialPayload.email,
        subscriptionId: initialPayload.subscriptionID,
        legalBasis: initialPayload.legalBasis,
        legalBasisExplanation: initialPayload.legalBasisExplanation,
      });
    });
  });

  describe('when calling subscribe with a user who has unsubscribed', () => {
    let result: boolean;
    const initialPayload: HubspotSubscribePayload = {
      email: 'a_new_subscriber2@somewhere.com',
      subscriptionID: HS_SUBSCRIPTION,
      legalBasis: 'CONSENT_WITH_NOTICE',
      legalBasisExplanation: 'User Opted-in during registration',
      source: 'unit test',
    };

    beforeAll(async () => {
      jest.clearAllMocks();
      mockHubspotClient.crm.contacts.basicApi.create.mockResolvedValueOnce({
        properties: {
          email: 'someone@somewhere.com',
        },
        id: 'an id',
        createdAt: new Date(1234567890),
        updatedAt: new Date(1234567890),
      });

      mockHubspotClient.communicationPreferences.statusApi.subscribe.mockRejectedValueOnce(
        {
          code: 400,
          body: {
            status: 'error',
            message:
              'Subscription 180551219 for a_new_subscriber2@somewhere.com cannot be updated because they have unsubscribed',
            correlationId: '92d5bd9a-9ae0-4b8f-bd3e-cbad0f54c0a4',
            category: 'VALIDATION_ERROR',
          },
        }
      );
      result = await firstValueFrom(sut.Subscribe(initialPayload));
    });

    it('should indicate the subscription has failed', () => {
      expect(result).toBe(false);
    });

    it('should call the hubspot create contact api', () => {
      expect(mockHubspotClient.crm.contacts.basicApi.create).toBeCalledWith({
        properties: {
          email: initialPayload.email,
          hs_persona: 'unit test',
        },
      });
    });

    it('should call the hubspot subscribe api', () => {
      expect(
        mockHubspotClient.communicationPreferences.statusApi.subscribe
      ).toBeCalledWith({
        emailAddress: initialPayload.email,
        subscriptionId: initialPayload.subscriptionID,
        legalBasis: initialPayload.legalBasis,
        legalBasisExplanation: initialPayload.legalBasisExplanation,
      });
    });
  });

  describe('when calling createDeal with an invalid deal stage', () => {
    const initialPayload: HubspotDealPayload = {
      dealName: 'Subscription',
      dealStage: 'registered',
      contactEmail: 'someone@somewhere.com',
    };

    beforeAll(async () => {
      jest.clearAllMocks();

      mockHubspotClient.crm.contacts.basicApi.getById.mockResolvedValueOnce({
        id: '901',
        properties: {
          createdate: '2023-04-29T02:10:57.260Z',
          email: 'a_new_subscriber2@somewhere.com',
          firstname: 'a_new_subscriber2_first_name',
          hs_object_id: '901',
          lastmodifieddate: '2023-04-29T02:10:57.260Z',
          lastname: 'a_new_subscriber2_last_name',
        },
        createdAt: new Date(1234567890),
        updatedAt: new Date(1234567890),
        archived: false,
      });

      mockHubspotClient.crm.deals.basicApi.create.mockRejectedValueOnce({
        code: 400,
        body: {
          status: 'error',
          message:
            'Property values were not valid: [{"isValid":false,"message":"registered is not a valid pipeline stage ID. Valid options are: pipelineId=default : [appointmentscheduled, qualifiedtobuy, presentationscheduled, decisionmakerboughtin, contractsent, closedwon, closedlost]","error":"INVALID_OPTION","name":"dealstage"}]',
          correlationId: '92d5bd9a-9ae0-4b8f-bd3e-cbad0f54c0a4',
          error: 'INVALID_OPTION',
          category: 'VALIDATION_ERROR',
        },
      });
    });

    it('should throw an error indicating the failure', async () => {
      const response = await firstValueFrom(
        sut.CreateDeal(initialPayload).pipe(
          catchError((err) => {
            return of(err);
          })
        )
      );

      expect(response).toEqual({
        message:
          'Property values were not valid: [{"isValid":false,"message":"registered is not a valid pipeline stage ID. Valid options are: pipelineId=default : [appointmentscheduled, qualifiedtobuy, presentationscheduled, decisionmakerboughtin, contractsent, closedwon, closedlost]","error":"INVALID_OPTION","name":"dealstage"}]',
        responseCode: 400,
        reason: 'HUBSPOT:VALIDATION_ERROR',
        isFormatted: true,
      });
    });
  });

  describe('when calling subscribe with a valid deal stage', () => {
    let result: {
      deal: SimplePublicObject;
      association: LabelsBetweenObjectPair;
    };
    const initialPayload: HubspotDealPayload = {
      dealName: 'Subscription',
      dealStage: 'qualifiedtobuy',
      contactEmail: 'a_new_subscriber2@somewhere.com',
    };

    beforeAll(async () => {
      jest.clearAllMocks();
      mockHubspotClient.crm.contacts.basicApi.getById.mockResolvedValueOnce({
        id: '901',
        properties: {
          createdate: '2023-04-29T02:10:57.260Z',
          email: 'a_new_subscriber2@somewhere.com',
          firstname: 'a_new_subscriber2_first_name',
          hs_object_id: '901',
          lastmodifieddate: '2023-04-29T02:10:57.260Z',
          lastname: 'a_new_subscriber2_last_name',
        },
        createdAt: new Date(1234567890),
        updatedAt: new Date(1234567890),
        archived: false,
      });
      mockHubspotClient.crm.deals.basicApi.create.mockResolvedValueOnce({
        id: '7287313132',
        properties: {
          createdate: '2023-04-29T03:09:33.016Z',
          days_to_close: '0',
          dealname: 'Subscription',
          dealstage: 'qualifiedtobuy',
          hs_closed_amount: '0',
          hs_closed_amount_in_home_currency: '0',
          hs_createdate: '2023-04-29T03:09:33.016Z',
          hs_deal_stage_probability_shadow:
            '0.40000000000000002220446049250313080847263336181640625',
          hs_is_closed: 'false',
          hs_is_closed_won: 'false',
          hs_is_deal_split: 'false',
          hs_lastmodifieddate: '2023-04-29T03:09:33.016Z',
          hs_object_id: '7287313132',
          hs_projected_amount: '0',
          hs_projected_amount_in_home_currency: '0',
          pipeline: 'default',
        },
        createdAt: new Date(1234567890),
        updatedAt: new Date(1234567890),
        archived: false,
      });

      mockHubspotClient.crm.deals.associationsApi.create.mockResolvedValueOnce({
        fromObjectTypeId: '0-3',
        fromObjectId: 7291324407,
        toObjectTypeId: '0-1',
        toObjectId: 901,
        labels: [],
      });

      result = await firstValueFrom(sut.CreateDeal(initialPayload));
    });

    it('should respond with the deal information', () => {
      expect(result).toStrictEqual({
        deal: {
          id: '7287313132',
          properties: {
            createdate: '2023-04-29T03:09:33.016Z',
            days_to_close: '0',
            dealname: 'Subscription',
            dealstage: 'qualifiedtobuy',
            hs_closed_amount: '0',
            hs_closed_amount_in_home_currency: '0',
            hs_createdate: '2023-04-29T03:09:33.016Z',
            hs_deal_stage_probability_shadow:
              '0.40000000000000002220446049250313080847263336181640625',
            hs_is_closed: 'false',
            hs_is_closed_won: 'false',
            hs_is_deal_split: 'false',
            hs_lastmodifieddate: '2023-04-29T03:09:33.016Z',
            hs_object_id: '7287313132',
            hs_projected_amount: '0',
            hs_projected_amount_in_home_currency: '0',
            pipeline: 'default',
          },
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
          archived: false,
        },
        association: {
          fromObjectTypeId: '0-3',
          fromObjectId: 7291324407,
          toObjectTypeId: '0-1',
          toObjectId: 901,
          labels: [],
        },
      });
    });

    it('should call the hubspot contact get api', () => {
      expect(mockHubspotClient.crm.contacts.basicApi.getById).toBeCalledWith(
        'a_new_subscriber2@somewhere.com',
        undefined,
        undefined,
        undefined,
        false,
        'email'
      );
    });

    it('should call the hubspot deal create api', () => {
      expect(mockHubspotClient.crm.deals.basicApi.create).toBeCalledWith({
        properties: {
          dealname: initialPayload.dealName,
          dealstage: initialPayload.dealStage,
          hubspot_owner_id: undefined,
          pipeline: 'default',
          amount: 0,
        },
      });
    });

    it('should call the hubspot associations api', () => {
      expect(mockHubspotClient.crm.deals.associationsApi.create).toBeCalledWith(
        7287313132,
        'CONTACT',
        901,
        []
      );
    });
  });

  describe('when calling updateDealStage with an invalid deal', () => {
    const initialPayload: HubspotDealUpdatePayload = {
      dealID: '09875',
      dealStage: 'closedwon',
    };

    beforeAll(async () => {
      jest.clearAllMocks();
      mockHubspotClient.crm.deals.basicApi.update.mockRejectedValueOnce({
        code: 404,
        body: {
          status: 'error',
          message: 'resource not found',
          correlationId: '92d5bd9a-9ae0-4b8f-bd3e-cbad0f54c0a4',
        },
      });
    });

    it('should throw an error indicating the failure', async () => {
      const response = await firstValueFrom(
        sut.UpdateDealStage(initialPayload).pipe(
          catchError((err) => {
            return of(err);
          })
        )
      );

      expect(response).toStrictEqual({
        message: 'resource not found',
        responseCode: 404,
        reason: 'HUBSPOT:404',
        isFormatted: true,
      });
    });
  });

  describe('when calling updateDealStage with a valid deal', () => {
    let result: SimplePublicObject;
    const initialPayload: HubspotDealUpdatePayload = {
      dealID: HS_DEAL_ID,
      dealStage: 'closedlost',
    };

    beforeAll(async () => {
      jest.clearAllMocks();
      mockHubspotClient.crm.deals.basicApi.update.mockResolvedValueOnce({
        id: '7291324407',
        properties: {
          createdate: '2023-04-29T07:12:06.510Z',
          days_to_close: '0',
          dealstage: 'closedwon',
          hs_closed_amount: '',
          hs_closed_amount_in_home_currency: '',
          hs_deal_stage_probability: '1',
          hs_deal_stage_probability_shadow: '1',
          hs_is_closed: 'true',
          hs_is_closed_won: 'true',
          hs_lastmodifieddate: '2023-04-29T07:41:09.611Z',
          hs_object_id: '7291324407',
          hs_projected_amount_in_home_currency: '',
          pipeline: 'default',
        },
        createdAt: new Date(1234567890),
        updatedAt: new Date(1234567890),
        archived: false,
      });
      result = await firstValueFrom(sut.UpdateDealStage(initialPayload));
    });

    it('should respond with the deal information', () => {
      expect(result).toEqual({
        id: '7291324407',
        properties: {
          createdate: '2023-04-29T07:12:06.510Z',
          days_to_close: '0',
          dealstage: 'closedwon',
          hs_closed_amount: '',
          hs_closed_amount_in_home_currency: '',
          hs_deal_stage_probability: '1',
          hs_deal_stage_probability_shadow: '1',
          hs_is_closed: 'true',
          hs_is_closed_won: 'true',
          hs_lastmodifieddate: '2023-04-29T07:41:09.611Z',
          hs_object_id: '7291324407',
          hs_projected_amount_in_home_currency: '',
          pipeline: 'default',
        },
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        archived: false,
      });
    });

    it('should call the hubspot deal update api', () => {
      expect(mockHubspotClient.crm.deals.basicApi.update).toBeCalledWith(
        '7291324407',
        { properties: { dealstage: 'closedlost' } }
      );
    });
  });

  describe('when calling getDealsForContact with an invalid contact', () => {
    const initialPayload: HubspotDealSearchPayload = {
      contactID: '000',
      dealNameFilter: 'Sub',
    };

    beforeAll(async () => {
      jest.clearAllMocks();
      mockHubspotClient.crm.deals.searchApi.doSearch.mockRejectedValueOnce({
        code: 404,
        body: {
          status: 'error',
          message: 'resource not found',
          correlationId: '92d5bd9a-9ae0-4b8f-bd3e-cbad0f54c0a4',
        },
      });
    });

    it('should throw an error indicating the failure', async () => {
      const response = await firstValueFrom(
        sut.GetDealsForContact(initialPayload).pipe(
          catchError((err) => {
            return of(err);
          })
        )
      );

      expect(response).toStrictEqual({
        message: 'resource not found',
        responseCode: 404,
        reason: 'HUBSPOT:404',
        isFormatted: true,
      });
    });
  });

  describe('when calling getDealsForContact with a valid contact', () => {
    let result: SimplePublicObject;
    const initialPayload: HubspotDealSearchPayload = {
      contactID: '901',
      dealNameFilter: 'Sub*',
    };

    beforeAll(async () => {
      jest.clearAllMocks();
      mockHubspotClient.crm.deals.searchApi.doSearch.mockResolvedValueOnce({
        total: 1,
        results: [
          {
            id: '7291324407',
            properties: {
              // following properties commented out due to index signature
              // amount: null,
              // closedate: null,
              createdate: '2023-04-29T07:12:06.510Z',
              dealname: 'Subscription',
              dealstage: 'closedlost',
              hs_lastmodifieddate: '2023-04-29T07:47:10.968Z',
              hs_object_id: '7291324407',
              pipeline: 'default',
            },
            createdAt: new Date(1234567890),
            updatedAt: new Date(1234567890),
            archived: false,
          },
        ],
      });
      result = await firstValueFrom(sut.GetDealsForContact(initialPayload));
    });

    it('should respond with the deal information', () => {
      expect(result).toEqual({
        id: '7291324407',
        properties: {
          // following properties commented out due to index signature
          // amount: null,
          // closedate: null,
          createdate: '2023-04-29T07:12:06.510Z',
          dealname: 'Subscription',
          dealstage: 'closedlost',
          hs_lastmodifieddate: '2023-04-29T07:47:10.968Z',
          hs_object_id: '7291324407',
          pipeline: 'default',
        },
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        archived: false,
      });
    });

    it('should call the hubspot deal search api', () => {
      expect(mockHubspotClient.crm.deals.searchApi.doSearch).toBeCalledWith({
        after: undefined,
        filterGroups: [
          {
            filters: [
              {
                operator: 'EQ',
                propertyName: 'associations.contact',
                value: '901',
              },
              {
                operator: 'CONTAINS_TOKEN',
                propertyName: 'dealname',
                value: 'Sub*',
              },
            ],
          },
        ],
        limit: 1,
        properties: undefined,
        sorts: undefined,
      });
    });
  });

  describe('when calling updateDealStageByContactEmail with an email', () => {
    let result: SimplePublicObject;
    const initialPayload: HubspotDealUpdateWithContactPayload = {
      email: 'a_new_subscriber2@somewhere.com',
      newDealStage: 'closedlost',
      dealNameFilter: 'Sub*',
    };

    beforeAll(async () => {
      jest.clearAllMocks();

      mockHubspotClient.crm.contacts.basicApi.getById.mockResolvedValueOnce({
        id: '801',
        properties: {
          createdate: '2023-04-28T06:09:18.190Z',
          email: 'a_new_subscriber@somewhere.com',
          firstname: 'a_new_subscriber_first_name',
          hs_object_id: '801',
          lastmodifieddate: '2023-04-28T06:09:20.043Z',
          lastname: 'a_new_subscriber_last_name',
        },
        createdAt: new Date(1234567890),
        updatedAt: new Date(1234567890),
        archived: false,
      });

      mockHubspotClient.crm.deals.basicApi.update.mockResolvedValueOnce({
        id: '7291324407',
        properties: {
          // following properties commented out due to index signature
          // amount: null,
          // closedate: null,
          createdate: '2023-04-29T07:12:06.510Z',
          dealname: 'Subscription',
          dealstage: 'closedlost',
          hs_lastmodifieddate: '2023-04-29T07:47:10.968Z',
          hs_object_id: '7291324407',
          pipeline: 'default',
        },
        createdAt: new Date(1234567890),
        updatedAt: new Date(1234567890),
        archived: false,
      });

      mockHubspotClient.crm.deals.searchApi.doSearch.mockResolvedValueOnce({
        total: 1,
        results: [
          {
            id: '7291324407',
            properties: {
              // following properties commented out due to index signature
              // amount: null,
              // closedate: null,
              createdate: '2023-04-29T07:12:06.510Z',
              dealname: 'Subscription',
              dealstage: 'closedlost',
              hs_lastmodifieddate: '2023-04-29T07:47:10.968Z',
              hs_object_id: '7291324407',
              pipeline: 'default',
            },
            createdAt: new Date(1234567890),
            updatedAt: new Date(1234567890),
            archived: false,
          },
        ],
      });
      result = await firstValueFrom(
        sut.UpdateDealStageByContactEmail(initialPayload)
      );
    });

    it('should respond with the deal information', () => {
      expect(result).toEqual({
        id: '7291324407',
        properties: {
          // following properties commented out due to index signature
          // amount: null,
          // closedate: null,
          createdate: '2023-04-29T07:12:06.510Z',
          dealname: 'Subscription',
          dealstage: 'closedlost',
          hs_lastmodifieddate: '2023-04-29T07:47:10.968Z',
          hs_object_id: '7291324407',
          pipeline: 'default',
        },
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        archived: false,
      });
    });

    it('should call the hubspot deal search api', () => {
      expect(mockHubspotClient.crm.deals.searchApi.doSearch).toBeCalledWith({
        after: undefined,
        filterGroups: [
          {
            filters: [
              {
                operator: 'EQ',
                propertyName: 'associations.contact',
                value: '801',
              },
              {
                operator: 'CONTAINS_TOKEN',
                propertyName: 'dealname',
                value: 'Sub*',
              },
            ],
          },
        ],
        limit: 1,
        properties: undefined,
        sorts: undefined,
      });
    });
  });
});
