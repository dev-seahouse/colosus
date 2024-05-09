import { Public } from '@bambu/server-core/common-guards';
import type { IColossusHttpRequestDto } from '@bambu/server-core/dto';
import { Decorators, ErrorUtils } from '@bambu/server-core/utilities';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseInterceptors,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { BambuCalculatorsIntegrationServiceBase } from './bambu-calculators-integration.service';
import * as Dto from './dto';

@Public() // TODO(benjamin): replace with appropriate decorator, see /libs/@bambu/server-core/common-guards/src/lib/auth_and_auth/README.md
@ApiTags('Bambu API Library')
@ApiExtraModels(
  Dto.BambuApiLibraryGetProjectionsRequestDto,
  Dto.BambuApiLibraryGetProjectionsResponseDto,
  Dto.BambuApiLibraryGetCountriesResponseDto,
  Dto.BambuApiLibraryGetCountryRatesResponseDto,
  Dto.BambuApiLibraryCalculateHouseGoalAmountRequestDto,
  Dto.BambuApiLibraryCalculateHouseGoalAmountResponseDto,
  Dto.BambuApiLibraryCalculateUniversityGoalAmountRequestDto,
  Dto.BambuApiLibraryCalculateUniversityGoalAmountResponseDto,
  Dto.BambuApiLibraryCalculateRetirementGoalAmountRequestDto,
  Dto.BambuApiLibraryCalculateRetirementGoalAmountResponseDto
)
@Controller('bambu-api-library-integration')
export class BambuCalculatorsIntegrationController {
  constructor(
    private readonly service: BambuCalculatorsIntegrationServiceBase
  ) {}

  @Version('1')
  @Post('graph-apis/projections')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: [
      `Provides access to the Projection Graph API in Bambu API Library.`,
      `Will derive token from client bearer token.`,
    ].join(' '),
    operationId: 'GetProjections',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.BambuApiLibraryGetProjectionsRequestDto,
    schema: {
      $ref: getSchemaPath(Dto.BambuApiLibraryGetProjectionsRequestDto),
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful API call.',
    schema: {
      $ref: getSchemaPath(Dto.BambuApiLibraryGetProjectionsResponseDto),
    },
  })
  public async GetProjections(
    @Body() input: Dto.BambuApiLibraryGetProjectionsRequestDto,
    @Req() httpRequest: IColossusHttpRequestDto,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BambuApiLibraryGetProjectionsResponseDto> {
    try {
      return await this.service.GetProjections(requestId, input, httpRequest);
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Version('1')
  @Get('country-metadata-apis/countries')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: [
      `To view a list of all the countries available in the platform and the dialing code, currency code.`,
    ].join(' '),
    operationId: 'GetCountries',
  })
  @ApiQuery({
    name: 'countryAlpha2Code',
    description: `The country's Alpha-2 code. See https://www.iban.com/country-codes.`,
    required: false,
    example: 'US',
    schema: {
      type: 'string',
      minLength: 2,
      maxLength: 2,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful API call.',
    type: Dto.BambuApiLibraryGetCountriesResponseDto,
    isArray: true,
  })
  public async GetCountries(
    @Req() httpRequest: IColossusHttpRequestDto,
    @Decorators.RequestId() requestId: string,
    @Query('countryAlpha2Code', new ValidationPipe())
    countryAlpha2Code?: string
  ): Promise<Dto.BambuApiLibraryGetCountriesResponseDto[]> {
    try {
      if (!countryAlpha2Code) {
        return this.service.GetCountries(requestId, httpRequest, null);
      }

      const base400Message = `The country's Alpha-2 code must be a string, 2 character's long without any whitespaces`;

      if (typeof countryAlpha2Code !== 'string') {
        throw new BadRequestException(
          `${base400Message}. The value supplied is not a valid string.`
        );
      }

      const countryCodeTrimmed = countryAlpha2Code.trim();
      if (countryCodeTrimmed.length != 2) {
        throw new BadRequestException(
          `${base400Message}. The value supplied is (${countryCodeTrimmed}).`
        );
      }

      return this.service.GetCountries(
        requestId,
        httpRequest,
        countryAlpha2Code
      );
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Version('1')
  @Get('country-metadata-apis/country-rates')
  @ApiOperation({
    summary: [
      `Retrieves the general rate information of a country such as inflation rates, savings rates, life expectancy rates.`,
    ].join(' '),
    operationId: 'GetCountryRates',
  })
  @ApiQuery({
    name: 'countryAlpha2Code',
    description: `The country's Alpha-2 code. See https://www.iban.com/country-codes.`,
    required: false,
    example: 'US',
    schema: {
      type: 'string',
      minLength: 2,
      maxLength: 2,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful API call.',
    type: Dto.BambuApiLibraryGetCountryRatesResponseDto,
    isArray: true,
  })
  public async GetCountryRates(
    @Req() httpRequest: IColossusHttpRequestDto,
    @Decorators.RequestId() requestId: string,
    @Query('countryAlpha2Code', new ValidationPipe()) countryAlpha2Code?: string
  ) {
    try {
      if (!countryAlpha2Code) {
        return this.service.GetCountryRates(requestId, httpRequest, null);
      }

      const base400Message = `The country's Alpha-2 code must be a string, 2 character's long without any whitespaces`;

      if (typeof countryAlpha2Code !== 'string') {
        throw new BadRequestException(
          `${base400Message}. The value supplied is not a valid string.`
        );
      }

      const countryCodeTrimmed = countryAlpha2Code.trim();
      if (countryCodeTrimmed.length != 2) {
        throw new BadRequestException(
          `${base400Message}. The value supplied is (${countryCodeTrimmed}).`
        );
      }

      return this.service.GetCountryRates(
        requestId,
        httpRequest,
        countryAlpha2Code
      );
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Version('1')
  @Post('house-apis/calculate-house-goal-amount')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Calculates prices of houses based on location and house type after adjustment to inflation.',
    operationId: 'CalculateHouseGoalAmount',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.BambuApiLibraryCalculateHouseGoalAmountRequestDto,
    schema: {
      $ref: getSchemaPath(
        Dto.BambuApiLibraryCalculateHouseGoalAmountRequestDto
      ),
    },
    examples: {
      ['USA Example']: {
        description: 'Example of a call for a US home.',
        value: {
          downPaymentYear: 2021,
          country: 'USA',
          region: 'Ohio',
          city: 'Akron',
          houseType: 'One Bed',
          downPaymentPct: 0.3,
          inflationRate: 0.05,
          currentYear: 2020,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful API call.',
    schema: {
      $ref: getSchemaPath(
        Dto.BambuApiLibraryCalculateHouseGoalAmountResponseDto
      ),
    },
  })
  public async CalculateHouseGoalAmount(
    @Body() input: Dto.BambuApiLibraryCalculateHouseGoalAmountRequestDto,
    @Req() httpRequest: IColossusHttpRequestDto,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BambuApiLibraryCalculateHouseGoalAmountResponseDto> {
    try {
      return await this.service.CalculateHouseGoalAmount(
        requestId,
        input,
        httpRequest
      );
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Version('1')
  @Post('education-apis/calculate-university-goal-amount')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: `Helps to calculate when an education goal can be accomplished.`,
    operationId: 'CalculateUniversityGoalAmount',
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.BambuApiLibraryCalculateUniversityGoalAmountRequestDto,
    schema: {
      $ref: getSchemaPath(
        Dto.BambuApiLibraryCalculateUniversityGoalAmountRequestDto
      ),
    },
    examples: {
      ['USA Example']: {
        description: 'Example of a call for a US education.',
        value: {
          age: 16,
          ageOfUni: 18,
          maxGoalYear: 24,
          universityType: 'Public',
          country: 'US',
          inflationRate: 0.03,
          currentYear: 2018,
          specialisation: 'General',
          state: 'Delaware',
          residencyType: 'instate',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful API call.',
    schema: {
      $ref: getSchemaPath(
        Dto.BambuApiLibraryCalculateUniversityGoalAmountResponseDto
      ),
    },
  })
  public async CalculateUniversityGoalAmount(
    @Body() input: Dto.BambuApiLibraryCalculateUniversityGoalAmountRequestDto,
    @Req() httpRequest: IColossusHttpRequestDto,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BambuApiLibraryCalculateUniversityGoalAmountResponseDto> {
    try {
      return this.service.CalculateUniversityGoalAmount(
        requestId,
        input,
        httpRequest
      );
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }

  @Version('1')
  @Post('retirement-apis/calculate-retirement-goal-amount')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: `Calculate the goal amount required for the whole retirement period such that user can retire comfortable with the estimated retirement amount.`,
  })
  @ApiBody({
    description: 'Input payload',
    type: Dto.BambuApiLibraryCalculateRetirementGoalAmountRequestDto,
    schema: {
      $ref: getSchemaPath(
        Dto.BambuApiLibraryCalculateRetirementGoalAmountRequestDto
      ),
    },
    examples: {
      ['USA Example']: {
        description: 'Example of a call for a US education.',
        value: {
          annualRetirementIncome: 95106.6,
          age: 50,
          retirementAge: 62,
          gender: 'Male',
          lifeExpectancyMale: 81,
          lifeExpectancyFemale: 86,
          annualisedSavingsAcctIntR: 0.02,
          annualisedInflationRate: 0.017,
          compoundsPerYear: 1,
          period: 'end',
          country: 'US',
          additionalSource: {
            retirementSavings: 10000,
            socialSecurityBenefit: 800,
            pension: 1000,
            colaRate: 0.024,
          },
          calculateTax: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successful API call.',
    schema: {
      $ref: getSchemaPath(
        Dto.BambuApiLibraryCalculateRetirementGoalAmountResponseDto
      ),
    },
  })
  public async CalculateRetirementGoalAmount(
    @Body() input: Dto.BambuApiLibraryCalculateRetirementGoalAmountRequestDto,
    @Req() httpRequest: IColossusHttpRequestDto,
    @Decorators.RequestId() requestId: string
  ): Promise<Dto.BambuApiLibraryCalculateRetirementGoalAmountResponseDto> {
    try {
      return await this.service.CalculateRetirementGoalAmount(
        requestId,
        input,
        httpRequest
      );
    } catch (error) {
      ErrorUtils.handleHttpControllerError(error);
    }
  }
}
