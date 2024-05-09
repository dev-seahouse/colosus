import { getWealthKernelConfiguration } from '@bambu/server-core/configuration';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  WealthKernelAccountsApiRepositoryService,
  WealthKernelAccountsApiRepositoryServiceBase,
} from './wealth-kernel-accounts-api-repository.service';
import {
  WealthKernelAddressesApiRepositoryService,
  WealthKernelAddressesApiRepositoryServiceBase,
} from './wealth-kernel-addresses-api-repository.service';
import {
  WealthKernelAuthApiRepositoryService,
  WealthKernelAuthApiRepositoryServiceBase,
} from './wealth-kernel-auth-api-repository.service';
import {
  WealthKernelBankAccountsApiRepositoryService,
  WealthKernelBankAccountsApiRepositoryServiceBase,
} from './wealth-kernel-bank-accounts-api-repository.service';
import {
  WealthKernelDirectDebitMandatesApiRepositoryService,
  WealthKernelDirectDebitMandatesApiRepositoryServiceBase,
} from './wealth-kernel-direct-debit-mandates-api-repository.service';
import {
  WealthKernelDirectDebitPaymentsApiRepositoryBaseService,
  WealthKernelDirectDebitPaymentsApiRepositoryService,
} from './wealth-kernel-direct-debit-payments-api-repository.service';
import {
  WealthKernelDirectDebitSubscriptionsApiRepositoryBaseService,
  WealthKernelDirectDebitSubscriptionsApiRepositoryService,
} from './wealth-kernel-direct-debit-subscriptions-api-repository.service';
import {
  WealthKernelModelsApiRepositoryService,
  WealthKernelModelsApiRepositoryServiceBase,
} from './wealth-kernel-models-api-repository.service';
import {
  WealthKernelPartiesApiRepositoryService,
  WealthKernelPartiesApiRepositoryServiceBase,
} from './wealth-kernel-parties-api-repository.service';
import {
  WealthKernelPerformanceApiRepositoryService,
  WealthKernelPerformanceApiRepositoryServiceBase,
} from './wealth-kernel-performance-api-repository.service';
import {
  WealthKernelPortfoliosApiRepositoryService,
  WealthKernelPortfoliosApiRepositoryServiceBase,
} from './wealth-kernel-portfolios-api-repository.service';
import {
  WealthKernelTransactionsApiRepositoryService,
  WealthKernelTransactionsApiRepositoryServiceBase,
} from './wealth-kernel-transactions-api-repository.service';
import {
  WealthKernelValuationsApiRepositoryService,
  WealthKernelValuationsApiRepositoryServiceBase,
} from './wealth-kernel-valuations-api-repository.service';
import {
  WealthKernelWithdrawalsApiService,
  WealthKernelWithdrawalsApiServiceBase,
} from './wealth-kernel-withdrawals-api.service';

@Module({
  imports: [ConfigModule.forFeature(getWealthKernelConfiguration), HttpModule],
  providers: [
    {
      provide: WealthKernelWithdrawalsApiServiceBase,
      useClass: WealthKernelWithdrawalsApiService,
    },
    {
      provide: WealthKernelPerformanceApiRepositoryServiceBase,
      useClass: WealthKernelPerformanceApiRepositoryService,
    },
    {
      provide: WealthKernelTransactionsApiRepositoryServiceBase,
      useClass: WealthKernelTransactionsApiRepositoryService,
    },
    {
      provide: WealthKernelDirectDebitSubscriptionsApiRepositoryBaseService,
      useClass: WealthKernelDirectDebitSubscriptionsApiRepositoryService,
    },
    {
      provide: WealthKernelDirectDebitPaymentsApiRepositoryBaseService,
      useClass: WealthKernelDirectDebitPaymentsApiRepositoryService,
    },
    {
      provide: WealthKernelDirectDebitMandatesApiRepositoryServiceBase,
      useClass: WealthKernelDirectDebitMandatesApiRepositoryService,
    },
    {
      provide: WealthKernelModelsApiRepositoryServiceBase,
      useClass: WealthKernelModelsApiRepositoryService,
    },
    {
      provide: WealthKernelValuationsApiRepositoryServiceBase,
      useClass: WealthKernelValuationsApiRepositoryService,
    },
    {
      provide: WealthKernelPortfoliosApiRepositoryServiceBase,
      useClass: WealthKernelPortfoliosApiRepositoryService,
    },
    {
      provide: WealthKernelAccountsApiRepositoryServiceBase,
      useClass: WealthKernelAccountsApiRepositoryService,
    },
    {
      provide: WealthKernelAuthApiRepositoryServiceBase,
      useClass: WealthKernelAuthApiRepositoryService,
    },
    {
      provide: WealthKernelPartiesApiRepositoryServiceBase,
      useClass: WealthKernelPartiesApiRepositoryService,
    },
    {
      provide: WealthKernelAddressesApiRepositoryServiceBase,
      useClass: WealthKernelAddressesApiRepositoryService,
    },
    {
      provide: WealthKernelBankAccountsApiRepositoryServiceBase,
      useClass: WealthKernelBankAccountsApiRepositoryService,
    },
  ],
  exports: [
    WealthKernelAuthApiRepositoryServiceBase,
    WealthKernelPartiesApiRepositoryServiceBase,
    WealthKernelAddressesApiRepositoryServiceBase,
    WealthKernelBankAccountsApiRepositoryServiceBase,
    WealthKernelAccountsApiRepositoryServiceBase,
    WealthKernelPortfoliosApiRepositoryServiceBase,
    WealthKernelValuationsApiRepositoryServiceBase,
    WealthKernelModelsApiRepositoryServiceBase,
    WealthKernelDirectDebitMandatesApiRepositoryServiceBase,
    WealthKernelDirectDebitPaymentsApiRepositoryBaseService,
    WealthKernelDirectDebitSubscriptionsApiRepositoryBaseService,
    WealthKernelTransactionsApiRepositoryServiceBase,
    WealthKernelPerformanceApiRepositoryServiceBase,
    WealthKernelWithdrawalsApiServiceBase,
  ],
})
export class WealthKernelApiRepositoryModule {}
