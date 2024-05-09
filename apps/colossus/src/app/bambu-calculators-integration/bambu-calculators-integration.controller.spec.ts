import { Test, TestingModule } from '@nestjs/testing';
import { BambuCalculatorsIntegrationController } from './bambu-calculators-integration.controller';
import { BambuCalculatorsIntegrationServiceBase } from './bambu-calculators-integration.service';
import {
  IBambuApiLibraryCalculateHouseGoalAmountRequestDto,
  IBambuApiLibraryCalculateHouseGoalAmountResponseDto,
  IBambuApiLibraryCalculateRetirementGoalAmountRequestDto,
  IBambuApiLibraryCalculateRetirementGoalAmountResponseDto,
  IBambuApiLibraryCalculateUniversityGoalAmountRequestDto,
  IBambuApiLibraryCalculateUniversityGoalAmountResponseDto,
  IBambuApiLibraryGetCountriesResponseDto,
  IBambuApiLibraryGetCountryRatesResponseDto,
  IBambuApiLibraryGetProjectionsRequestDto,
  IBambuApiLibraryGetProjectionsResponseDto,
} from '@bambu/shared';

import type { Request } from 'express';

class MockBambuCalculatorsIntegrationService
  implements BambuCalculatorsIntegrationServiceBase
{
  GetProjections(
    requestId: string,
    input: IBambuApiLibraryGetProjectionsRequestDto,
    httpRequest: Request
  ): Promise<IBambuApiLibraryGetProjectionsResponseDto> {
    return Promise.resolve(undefined);
  }

  CalculateHouseGoalAmount(
    requestId: string,
    input: IBambuApiLibraryCalculateHouseGoalAmountRequestDto,
    httpRequest: Request
  ): Promise<IBambuApiLibraryCalculateHouseGoalAmountResponseDto> {
    return Promise.resolve(null);
  }

  CalculateUniversityGoalAmount(
    requestId: string,
    input: IBambuApiLibraryCalculateUniversityGoalAmountRequestDto,
    httpRequest: Request
  ): Promise<IBambuApiLibraryCalculateUniversityGoalAmountResponseDto> {
    return Promise.resolve(null);
  }

  GetCountries(
    requestId: string,
    httpRequest: Request,
    countryAlpha2Code: string | null
  ): Promise<IBambuApiLibraryGetCountriesResponseDto[]> {
    return Promise.resolve([]);
  }

  GetCountryRates(
    requestId: string,
    httpRequest: Request,
    countryAlpha2Code: string | null
  ): Promise<IBambuApiLibraryGetCountryRatesResponseDto[]> {
    return Promise.resolve([]);
  }

  CalculateRetirementGoalAmount(
    requestId: string,
    input: IBambuApiLibraryCalculateRetirementGoalAmountRequestDto,
    httpRequest: Request
  ): Promise<IBambuApiLibraryCalculateRetirementGoalAmountResponseDto> {
    return Promise.resolve(undefined);
  }
}

describe('BambuCalculatorsIntegrationController', () => {
  let controller: BambuCalculatorsIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BambuCalculatorsIntegrationController],
      providers: [
        {
          useClass: MockBambuCalculatorsIntegrationService,
          provide: BambuCalculatorsIntegrationServiceBase,
        },
      ],
    }).compile();

    controller = module.get<BambuCalculatorsIntegrationController>(
      BambuCalculatorsIntegrationController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
