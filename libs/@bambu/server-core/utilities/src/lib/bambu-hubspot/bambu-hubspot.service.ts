import { Client } from '@hubspot/api-client';
import { PublicUpdateSubscriptionStatusRequest } from '@hubspot/api-client/lib/codegen/communication_preferences';
import { SimplePublicObjectInput } from '@hubspot/api-client/lib/codegen/crm/companies';
import { BadRequestException, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { catchError, defer, EMPTY, from, map, of, switchMap, tap } from 'rxjs';
import { Stringify } from '../json-utils';
import {
  HUBSPOT_EVENTS,
  HubspotCreateContactPayload,
  HubspotError,
  HubspotSubscribePayload,
  HubspotUpdateContactPayload,
  isHubspotError,
} from './types';
import { HubspotDealPayload } from './types/hubspot-deal-payload.type';
import { HubspotDealSearchPayload } from './types/hubspot-deal-search-payload.type';
import { HubspotDealUpdatePayload } from './types/hubspot-deal-update-payload.type';
import { HubspotDealUpdateWithContactPayload } from './types/hubspot-deal-update-with-contact-payload.type';
import { BambuEventEmitterServiceBase } from '../bambu-event-emitter/bambu-event-emitter-service.base';

type Error = {
  code: number;
  body: {
    status: number;
    message: string;
    correlationId: string;
    errors: string[];
    links: unknown;
    category: string;
  };
};

const PRODUCT_NAME = 'Bambu GO';

type HubspotConfiguration = {
  accessToken: string;
  basePath: string;
  hsSourceProperty: string;
  marketingSubscriptionId: string;
  pipelineID: string;
  initialPipelineStepId: string;
  wonPipelineStepId: string;
  lostPipelineStepId: string;
  isDisabled: boolean;
};

export class BambuHubspotService {
  private hubspotClient: Client;
  readonly #hsSourceProperty: string;
  readonly #hubspotIsDisabled: boolean;

  constructor(
    private readonly hubspotConfig: HubspotConfiguration,
    private readonly logger: Logger,
    private readonly eventEmitter: BambuEventEmitterServiceBase
  ) {
    this.hubspotClient = new Client({
      basePath: this.hubspotConfig.basePath,
      accessToken: this.hubspotConfig.accessToken,
      // defaultHeaders: '',
      // limiterOptions: '',
      // numberOfApiCallRetries: ''
    });

    // Set up the specific properties.
    if (this.hubspotConfig.hsSourceProperty) {
      this.#hsSourceProperty = this.hubspotConfig.hsSourceProperty;
    } else {
      this.#hsSourceProperty = 'hs_persona';
    }

    this.#hubspotIsDisabled = this.hubspotConfig.isDisabled;
  }

  @OnEvent(HUBSPOT_EVENTS.SUBSCRIBE)
  onHandleSubscribe(payload: HubspotSubscribePayload) {
    if (this.#hubspotIsDisabled) {
      this.logger.log(`${HUBSPOT_EVENTS.SUBSCRIBE}: disabled.`);
      return;
    }
    return this.Subscribe(payload)
      .pipe(
        catchError((err: HubspotError) => {
          this.logger.error(
            `${HUBSPOT_EVENTS.SUBSCRIBE_ERROR}: ERROR ${err.message}.`
          );
          throw err;
        }),
        tap((result) =>
          this.logger.log(
            `${HUBSPOT_EVENTS.SUBSCRIBE}: completed with result: ${result}.`
          )
        )
      )
      .subscribe();
  }

  @OnEvent(HUBSPOT_EVENTS.CONTACT_UPDATE)
  onHandleUpdateContact(eventPayload: {
    email: string;
    payload: HubspotUpdateContactPayload;
  }) {
    if (this.#hubspotIsDisabled) {
      this.logger.log(`${HUBSPOT_EVENTS.CONTACT_UPDATE}: disabled.`);
      return;
    }

    const { email, payload } = eventPayload;

    return this.UpdateContact(email, payload)
      .pipe(
        catchError((err: HubspotError) => {
          this.logger.error(
            `${HUBSPOT_EVENTS.CONTACT_UPDATE_ERROR}: ERROR ${err.message}.`
          );
          throw err;
        }),
        tap((result) =>
          this.logger.log(
            `${HUBSPOT_EVENTS.CONTACT_UPDATE}: completed with result: ${result}.`
          )
        )
      )
      .subscribe();
  }

  @OnEvent(HUBSPOT_EVENTS.CREATE_DEAL)
  onHandleCreateDeal(payload: HubspotDealPayload) {
    if (this.#hubspotIsDisabled) {
      this.logger.log(`${HUBSPOT_EVENTS.CREATE_DEAL}: disabled.`);
      return;
    }

    return this.CreateDeal(payload)
      .pipe(
        catchError((err: HubspotError) => {
          this.logger.error(
            `${HUBSPOT_EVENTS.CREATE_DEAL_ERROR}: ERROR ${err.message}.`
          );
          throw err;
        }),
        tap((result) =>
          this.logger.log(
            `${HUBSPOT_EVENTS.CREATE_DEAL}: completed with result: ${result}.`
          )
        )
      )
      .subscribe();
  }

  @OnEvent(HUBSPOT_EVENTS.UPDATE_DEAL_STAGE)
  onHandleUpdateDealStage(payload: HubspotDealUpdateWithContactPayload) {
    if (this.#hubspotIsDisabled) {
      this.logger.log(`${HUBSPOT_EVENTS.UPDATE_DEAL_STAGE}: disabled.`);
      return;
    }
    return this.UpdateDealStageByContactEmail(payload)
      .pipe(
        catchError((err: HubspotError) => {
          this.logger.error(
            `${HUBSPOT_EVENTS.UPDATE_DEAL_STAGE_ERROR}: ERROR ${err.message}.`
          );
          throw err;
        }),
        tap((result) =>
          this.logger.log(
            `${HUBSPOT_EVENTS.UPDATE_DEAL_STAGE}: completed with result: ${result}.`
          )
        )
      )
      .subscribe();
  }

  @OnEvent(HUBSPOT_EVENTS.ENABLE_MARKETING)
  onEnableMarketing(email: string) {
    if (this.#hubspotIsDisabled) {
      this.logger.log(`${HUBSPOT_EVENTS.ENABLE_MARKETING}: disabled.`);
      return;
    }
    const subscriptionID = this.hubspotConfig.marketingSubscriptionId;
    if (subscriptionID) {
      this.Subscribe({
        email,
        legalBasis: 'CONSENT_WITH_NOTICE',
        legalBasisExplanation: 'User requested marketing upon registration',
        subscriptionID: subscriptionID,
      })
        .pipe(
          catchError((err: HubspotError) => {
            this.logger.error(
              `${HUBSPOT_EVENTS.ENABLE_MARKETING_ERROR}: ERROR ${err.message}.`
            );
            throw err;
          }),
          tap((result) =>
            this.logger.log(
              `${HUBSPOT_EVENTS.SUBSCRIBE}: completed with result: ${result}.`
            )
          )
        )
        .subscribe();
    }
  }

  @OnEvent(HUBSPOT_EVENTS.INITIALISE_DEAL_PIPELINE)
  onInitialiseDealPipeline(payload: {
    email: string;
    dealName: string;
    amount?: number;
  }) {
    if (this.#hubspotIsDisabled) {
      this.logger.log(`${HUBSPOT_EVENTS.INITIALISE_DEAL_PIPELINE}: disabled.`);
      return;
    }
    const { email, amount = 0, dealName } = payload;
    return this.CreateDeal({
      contactEmail: email,
      dealName: `${PRODUCT_NAME} - ${dealName}`,
      dealStage: this.hubspotConfig.initialPipelineStepId,
      amount: amount,
      pipeline: this.hubspotConfig.pipelineID,
    })
      .pipe(
        catchError((err: HubspotError) => {
          this.logger.error(
            `${HUBSPOT_EVENTS.INITIALISE_DEAL_PIPELINE_ERROR}: ERROR ${err.message}`
          );
          throw err;
        }),
        tap((result) =>
          this.logger.log(
            `${HUBSPOT_EVENTS.INITIALISE_DEAL_PIPELINE}: completed with result: ${result}`
          )
        )
      )
      .subscribe();
  }

  @OnEvent(HUBSPOT_EVENTS.MOVE_DEAL_TO_LOST)
  onMoveDealToLost(email: string) {
    if (this.#hubspotIsDisabled) {
      this.logger.log(`${HUBSPOT_EVENTS.MOVE_DEAL_TO_LOST}: disabled.`);
      return;
    }
    return this.UpdateDealStageByContactEmail({
      email: email,
      newDealStage: this.hubspotConfig.lostPipelineStepId,
      dealNameFilter: `${PRODUCT_NAME}*`,
    })
      .pipe(
        catchError((err: HubspotError) => {
          this.logger.error(
            `${HUBSPOT_EVENTS.MOVE_DEAL_TO_LOST_ERROR}: ERROR ${err.message}.`
          );
          throw err;
        }),
        tap((result) =>
          this.logger.log(
            `${HUBSPOT_EVENTS.MOVE_DEAL_TO_LOST}: completed with result: ${result}.`
          )
        )
      )
      .subscribe();
  }

  @OnEvent(HUBSPOT_EVENTS.MOVE_DEAL_TO_WON)
  onMoveDealToWon(email: string) {
    if (this.#hubspotIsDisabled) {
      this.logger.log(`${HUBSPOT_EVENTS.MOVE_DEAL_TO_WON}: disabled.`);
      return;
    }
    return this.UpdateDealStageByContactEmail({
      email: email,
      newDealStage: this.hubspotConfig.wonPipelineStepId,
      dealNameFilter: `${PRODUCT_NAME}*`,
    })
      .pipe(
        catchError((err: HubspotError) => {
          this.logger.error(
            `${HUBSPOT_EVENTS.MOVE_DEAL_TO_WON_ERROR}: ERROR ${err.message}.`
          );
          throw err;
        }),
        tap((result) => {
          const baseMessage = `${HUBSPOT_EVENTS.MOVE_DEAL_TO_WON}: completed.`;
          this.logger.log(baseMessage);

          const debugMessage = `${baseMessage} Result: ${Stringify(result)}`;
          this.logger.debug(debugMessage);
        })
      )
      .subscribe();
  }

  FormatHubspotError(err: Error): HubspotError {
    // If the error has previously been formatted, then just return it
    if (isHubspotError(err)) {
      return err;
    }
    return {
      message: typeof err.body === 'string' ? err.body : err.body?.message,
      responseCode: err.code,
      reason: `HUBSPOT:${err.body?.category || err.code}`,
      isFormatted: true,
    };
  }

  /**
   * Creates a contact in hubspot.  If the contact already exists then this
   * will throw a HubspotError.
   *
   * Hubspot permissions required for this call: crm.objects.contacts.write
   *
   * @param payload the email address of the user to subscribe
   * @returns the created user information, in the format of a Hubspot SimplePublicObject
   */
  CreateContact(payload: HubspotCreateContactPayload) {
    const hubspotCreateContact: SimplePublicObjectInput = {
      properties: {
        email: payload.email,
        [this.#hsSourceProperty]: payload.source,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    };
    return defer(() => {
      return from(
        //this.hubspotClient.crm.contacts.basicApi.create(hubspotCreateContact)
        this.createContactSafe(hubspotCreateContact)
      );
    }).pipe(
      catchError((err) => {
        throw this.FormatHubspotError(err);
      })
    );
  }

  /**
   * Creates a contact in hubspot.
   * If the deal already exists then it will return existing contact.
   *
   * Impetus was to counter race condition where create contact was called twice from 2 events at the same time.
   * @param hubspotCreateContact
   * @private
   */
  private async createContactSafe(
    hubspotCreateContact: SimplePublicObjectInput
  ) {
    try {
      return await this.hubspotClient.crm.contacts.basicApi.create(
        hubspotCreateContact
      );
    } catch (error) {
      if (
        (error as Error)?.code == 409 &&
        (error as Error)?.body?.message.indexOf('Contact already exists') > -1
      ) {
        this.logger.log(
          `${
            this.createContactSafe.name
          } Contact already exists in hubspot: ${Stringify(error)}.`
        );
        return this.hubspotClient.crm.contacts.basicApi.getById(
          hubspotCreateContact.properties.email,
          undefined,
          undefined,
          undefined,
          false,
          'email'
        );
      }

      this.logger.error(
        `${
          this.createContactSafe.name
        } Error creating contact in hubspot: ${Stringify(error)}.`
      );
      throw error;
    }
  }

  /**
   * Subscribes an email address to the subscription specified.
   * This will first ensure that a contact is created in hubspot and then
   * will subscribe that contact to the subscriptionTypeID
   *
   * Hubspot permissions required for this call: communication_preferences.write
   *
   * @param payload the email address, subscription and legal basis for subscribing the user
   * @returns true if the user is subscribed after this call, false otherwise
   */
  Subscribe(payload: HubspotSubscribePayload) {
    const hubspotSubscribeRequest: PublicUpdateSubscriptionStatusRequest = {
      emailAddress: payload.email,
      subscriptionId: payload.subscriptionID,
      legalBasis: payload.legalBasis,
      legalBasisExplanation: payload.legalBasisExplanation,
    };

    if (!hubspotSubscribeRequest.emailAddress) {
      throw new BadRequestException(
        'No email address provided for hubspot contact'
      );
    }

    if (!hubspotSubscribeRequest.subscriptionId) {
      throw new BadRequestException(
        'No subscription id provided for hubspot contact'
      );
    }

    // First make sure the contact exists, then add the subscription
    return this.CreateContact({
      email: payload.email,
      source: payload.source,
    }).pipe(
      catchError((err: HubspotError) => {
        if (err.responseCode === 409) {
          // This is okay, it means the contact already exists so just add to the sub
          return of({
            properties: {
              email: payload.email,
            },
          });
        } else {
          throw new BadRequestException(err.message);
        }
      }),
      map((contactResult) => contactResult.properties.email),

      switchMap(() => {
        // In order to reduce the hubspot permissions we use the negative flows rather than querying the status
        return this.hubspotClient.communicationPreferences.statusApi.subscribe(
          hubspotSubscribeRequest
        );
      }),
      catchError((err) => {
        const error = err.body ? this.FormatHubspotError(err) : err;
        // The user is already subscribed, all okay
        if (
          error.responseCode === 400 &&
          error.reason === 'HUBSPOT:VALIDATION_ERROR' &&
          error.message.includes('already subscribed')
        ) {
          return of(true);
        } else if (
          error.responseCode === 400 &&
          error.reason === 'HUBSPOT:VALIDATION_ERROR' &&
          error.message.includes('unsubscribed')
        ) {
          return of(false);
        }
        throw error;
      }),
      map((res) => res !== false)
    );
  }

  /**
   * Gets a hubspot contact
   *
   * Hubspot permissions required for this call:
   * - crm.objects.contacts.read
   */
  GetContact(email: string) {
    return defer(() => {
      return from(
        this.hubspotClient.crm.contacts.basicApi.getById(
          email,
          undefined,
          undefined,
          undefined,
          false,
          'email'
        )
      );
    }).pipe(
      catchError((err) => {
        throw this.FormatHubspotError(err);
      })
    );
  }

  /**
   * Updates a contact with the details provided in the payload
   *
   * Hubspot permissions required for this call:
   * - crm.objects.contacts.write
   *
   * @param email the email address of the contact to update
   * @param payload the properties to update
   * @returns the updated contact details
   */
  UpdateContact(email: string, payload: HubspotUpdateContactPayload) {
    const hubspotUpdateContact: SimplePublicObjectInput = {
      properties: Object.keys(payload).reduce((acc, key) => {
        const coercedKey = key as keyof HubspotUpdateContactPayload;
        if (typeof payload[coercedKey] !== 'undefined') {
          acc[coercedKey] = payload[coercedKey];
        }
        return acc;
      }, {} as HubspotUpdateContactPayload),
    };

    return defer(() => {
      return from(
        this.hubspotClient.crm.contacts.basicApi.update(
          email,
          hubspotUpdateContact,
          'email'
        )
      );
    }).pipe(
      catchError((err) => {
        throw this.FormatHubspotError(err);
      })
    );
  }

  /**
   * Creates a deal in hubspot
   *
   * Hubspot permissions required for this call:
   * - crm.objects.deals.write
   * - crm.objects.deals.read
   */
  CreateDeal(payload: HubspotDealPayload) {
    const hubspotDealRequest = {
      dealname: payload.dealName,
      dealstage: payload.dealStage,
      pipeline: payload.pipeline || 'default',
      hubspot_owner_id: payload.hubspotOwnerID || undefined,
      amount: payload.amount || 0,
    };

    // TODO: Remove
    this.logger.debug(
      `${this.CreateDeal.name} Creating deal ${JSON.stringify({
        hubspotDealRequest,
        payload,
      })}`
    );

    if (!hubspotDealRequest.dealname) {
      this.logger.error(
        `${this.CreateDeal.name} No dealname provided for deal`
      );
      return EMPTY;
    }

    if (!hubspotDealRequest.dealstage) {
      this.logger.error(
        `${this.CreateDeal.name} No dealstage provided for deal`
      );
      return EMPTY;
    }

    return this.GetContact(payload.contactEmail).pipe(
      catchError((err) => {
        // TODO: Remove
        const debugLogging = [
          `${this.CreateDeal.name} Error getting contact catchError.`,
          `email: ${payload.contactEmail}.`,
          `error: ${err ? Stringify(err) : 'null'}.`,
        ].join(' ');
        this.logger.debug(debugLogging);

        // Not found in hubspot, that is okay
        if (err.responseCode === 404) {
          return of(null);
        }
        throw err;
      }),
      switchMap((contact) => {
        if (contact) {
          return of(contact);
        }
        return this.CreateContact({
          email: payload.contactEmail,
        });
      }),
      map((contact) => contact.id),
      // Create the Deal
      switchMap((contactID) => {
        return from(
          this.hubspotClient.crm.deals.basicApi.create({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            properties: hubspotDealRequest as any,
          })
        ).pipe(
          map((deal) => ({
            deal: deal,
            contactID: contactID,
          }))
        );
      }),
      // Associate the contact
      switchMap((dealAssociation) => {
        return from(
          this.hubspotClient.crm.deals.associationsApi.create(
            Number(dealAssociation.deal.id),
            'CONTACT',
            Number(dealAssociation.contactID),
            []
          )
        ).pipe(
          map((association) => {
            return {
              deal: dealAssociation.deal,
              association: association,
            };
          })
        );
      }),
      catchError((err) => {
        // TODO: Remove
        const debugLogging = [
          `${this.CreateDeal.name} Error creating deal catchError.`,
          `Input: ${Stringify(hubspotDealRequest)}.`,
          `error: ${err ? Stringify(err) : 'null'}.`,
        ].join(' ');
        this.logger.debug(debugLogging);

        throw this.FormatHubspotError(err);
      })
    );
  }

  UpdateDealStage(payload: HubspotDealUpdatePayload) {
    const hubspotDealUpdate = {
      dealID: payload.dealID,
      dealstage: payload.dealStage,
    };

    if (!hubspotDealUpdate.dealID) {
      throw new BadRequestException('No deal id provided for deal');
    }

    if (!hubspotDealUpdate.dealstage) {
      throw new BadRequestException('No dealstage provided for deal');
    }

    return defer(() => {
      return from(
        this.hubspotClient.crm.deals.basicApi.update(hubspotDealUpdate.dealID, {
          properties: {
            dealstage: hubspotDealUpdate.dealstage,
          },
        })
      );
    }).pipe(
      catchError((err) => {
        throw this.FormatHubspotError(err);
      })
    );
  }

  GetDealsForContact(payload: HubspotDealSearchPayload) {
    if (!payload.contactID) {
      throw new BadRequestException('No contact id provided for deal');
    }

    const dealNameFilter = payload.dealNameFilter;

    return defer(() => {
      return from(
        this.hubspotClient.crm.deals.searchApi.doSearch({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'associations.contact',
                  operator: 'EQ',
                  value: payload.contactID,
                },
                dealNameFilter && {
                  propertyName: 'dealname',
                  operator: 'CONTAINS_TOKEN',
                  value: dealNameFilter,
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ].filter((i) => i) as any,
            },
          ],
          limit: 1,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          after: undefined as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          properties: undefined as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          sorts: undefined as any,
        })
      );
    }).pipe(
      map((deals) => {
        if (deals.total === 0) {
          throw {
            code: 404,
            body: {
              status: 'error',
              message: 'resource not found',
              correlationId: '92d5bd9a-9ae0-4b8f-bd3e-cbad0f54c0a4',
            },
          };
        }
        return deals.results[0];
      }),
      catchError((err) => {
        throw this.FormatHubspotError(err);
      })
    );
  }

  UpdateDealStageByContactEmail(payload: HubspotDealUpdateWithContactPayload) {
    const hubspotDealUpdate = {
      email: payload.email,
      dealstage: payload.newDealStage,
      dealNameFilter: payload.dealNameFilter,
    };

    if (!hubspotDealUpdate.email) {
      throw new BadRequestException('No email provided for contact');
    }

    if (!hubspotDealUpdate.dealstage) {
      throw new BadRequestException('No dealstage provided for deal');
    }

    return this.GetContact(hubspotDealUpdate.email)
      .pipe(
        switchMap((contact) => {
          return this.GetDealsForContact({
            contactID: contact.id,
            dealNameFilter: payload.dealNameFilter,
          });
        }),
        switchMap((deal) => {
          return this.UpdateDealStage({
            dealID: deal.id,
            dealStage: payload.newDealStage,
          });
        })
      )
      .pipe(
        catchError((err) => {
          throw this.FormatHubspotError(err);
        })
      );
  }
}
