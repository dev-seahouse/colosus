import { IStripeIntegrationConfigDto } from '@bambu/server-core/configuration';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class BaseStripeRepositoryService {
  protected readonly stripeConfig: IStripeIntegrationConfigDto;

  constructor(
    private readonly configService: ConfigService<IStripeIntegrationConfigDto>
  ) {
    this.stripeConfig = {
      secretKey: this.configService.getOrThrow('secretKey', {
        infer: true,
      }),
      apiVersion: this.configService.getOrThrow('apiVersion', {
        infer: true,
      }),
      webhookEndpointSecret: this.configService.getOrThrow(
        'webhookEndpointSecret',
        {
          infer: true,
        }
      ),
    };
  }

  protected get stripeClient() {
    return new Stripe(this.stripeConfig.secretKey, {
      apiVersion: this.stripeConfig.apiVersion as Stripe.LatestApiVersion,
    });
  }
}
