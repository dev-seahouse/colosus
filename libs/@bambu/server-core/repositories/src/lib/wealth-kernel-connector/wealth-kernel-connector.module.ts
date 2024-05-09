import { getWealthKernelConfiguration } from '@bambu/server-core/configuration';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  WealthKernelConnectorDirectDebitApiRepositoryService,
  WealthKernelConnectorDirectDebitApiRepositoryServiceBase,
} from './wealth-kernel-connector-direct-debit-api-repository.service';
import {
  WealthKernelConnectorPartiesApiRepositoryService,
  WealthKernelConnectorPartiesApiRepositoryServiceBase,
} from './wealth-kernel-connector-parties-api-repository.service';
import {
  WealthKernelConnectorPerformanceApiRepositoryService,
  WealthKernelConnectorPerformanceApiRepositoryServiceBase,
} from './wealth-kernel-connector-performance-api-repository.service';
import {
  WealthKernelConnectorPortfoliosApiRepositoryService,
  WealthKernelConnectorPortfoliosApiRepositoryServiceBase,
} from './wealth-kernel-connector-portfolios-api-repository.service';
import {
  WealthKernelConnectorTransactionsApiRepositoryService,
  WealthKernelConnectorTransactionsApiRepositoryServiceBase,
} from './wealth-kernel-connector-transactions-api-repository.service';
import {
  WealthKernelConnectorValuationsApiRepositoryService,
  WealthKernelConnectorValuationsApiRepositoryServiceBase,
} from './wealth-kernel-connector-valuations-api-repository.service';
import {
  WealthKernelConnectorWithdrawalsApiRepositoryService,
  WealthKernelConnectorWithdrawalsApiRepositoryServiceBase,
} from './wealth-kernel-connector-withdrawals-api-repository.service';

@Module({
  imports: [ConfigModule.forFeature(getWealthKernelConfiguration), HttpModule],
  providers: [
    {
      provide: WealthKernelConnectorWithdrawalsApiRepositoryServiceBase,
      useClass: WealthKernelConnectorWithdrawalsApiRepositoryService,
    },
    {
      provide: WealthKernelConnectorPerformanceApiRepositoryServiceBase,
      useClass: WealthKernelConnectorPerformanceApiRepositoryService,
    },
    {
      provide: WealthKernelConnectorTransactionsApiRepositoryServiceBase,
      useClass: WealthKernelConnectorTransactionsApiRepositoryService,
    },
    {
      provide: WealthKernelConnectorPortfoliosApiRepositoryServiceBase,
      useClass: WealthKernelConnectorPortfoliosApiRepositoryService,
    },
    {
      provide: WealthKernelConnectorValuationsApiRepositoryServiceBase,
      useClass: WealthKernelConnectorValuationsApiRepositoryService,
    },
    {
      provide: WealthKernelConnectorDirectDebitApiRepositoryServiceBase,
      useClass: WealthKernelConnectorDirectDebitApiRepositoryService,
    },
    {
      provide: WealthKernelConnectorPartiesApiRepositoryServiceBase,
      useClass: WealthKernelConnectorPartiesApiRepositoryService,
    },
  ],
  exports: [
    WealthKernelConnectorPartiesApiRepositoryServiceBase,
    WealthKernelConnectorDirectDebitApiRepositoryServiceBase,
    WealthKernelConnectorValuationsApiRepositoryServiceBase,
    WealthKernelConnectorPortfoliosApiRepositoryServiceBase,
    WealthKernelConnectorTransactionsApiRepositoryServiceBase,
    WealthKernelConnectorPerformanceApiRepositoryServiceBase,
    WealthKernelConnectorWithdrawalsApiRepositoryServiceBase,
  ],
})
export class WealthKernelConnectorModule {}
