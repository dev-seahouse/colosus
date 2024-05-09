// noinspection ES6PreferShortImport
// https://stackoverflow.com/questions/58843038/how-to-manually-test-input-validation-with-nestjs-and-class-validator
import { plainToInstance } from 'class-transformer';
import { ConnectPortfolioSummaryRequestDto } from './connect-portfolio-summary-request.dto';
import { validate } from 'class-validator';
import { ConnectPortfolioSummaryAssetClassAllocationItemDto } from './connect-portfolio-summary-asset-class-allocation.dto';

describe('ConnectPortfolioSummaryRequestDto', () => {
  const validBody = {
    key: 'MODERATE',
    name: 'Conservative Portfolio',
    description:
      'This portfolio primarily looks to preserve capital through a conservative asset allocation.',
    expectedReturnPercent: '4',
    expectedVolatilityPercent: '3.5',
    showSummaryStatistics: true,
    assetClassAllocation: [
      { assetClass: 'Equity', percentOfPortfolio: '3.5', included: true },
    ],
  };

  it("should have well-formed bodies pass validation, even it asset-class items' percentOfPortfolio do not sum to 100", async () => {
    expect.assertions(1);
    const exampleDto = plainToInstance(
      ConnectPortfolioSummaryRequestDto,
      validBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(0);
  });
  it('should validate array members', async () => {
    expect.assertions(2);
    const assetClassAllocation = [
      { assetClass: 'Equity', percentOfPortfolio: '3.5' },
    ];
    const exampleItemDto = plainToInstance(
      ConnectPortfolioSummaryAssetClassAllocationItemDto,
      assetClassAllocation
    );
    const itemErrors = await validate(exampleItemDto, {
      forbidUnknownValues: true,
    });
    expect(itemErrors).toHaveLength(1);
    const exampleBody = {
      ...validBody,
      assetClassAllocation: exampleItemDto,
    };
    const exampleDto = plainToInstance(
      ConnectPortfolioSummaryRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(1);
  });
  it('ignores validating that the key is one of "CONSERVATIVE" or "MODERATE" or "AGGRESSIVE"', async () => {
    expect.assertions(1);
    const exampleBody = {
      ...validBody,
      key: 'INVALID',
    };
    const exampleDto = plainToInstance(
      ConnectPortfolioSummaryRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(0);
  });
  it('ignores validating for now that numeric strings are indeed so', async () => {
    expect.assertions(1);
    const exampleBody = {
      ...validBody,
      expectedReturnPercent: 'INVALID',
      expectedVolatilityPercent: 'INVALID',
      assetClassAllocation: [
        { assetClass: 'Equity', percentOfPortfolio: 'INVALID', included: true },
      ],
    };
    const exampleDto = plainToInstance(
      ConnectPortfolioSummaryRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(0);
  });
  it('ignores validating the asset class for now', async () => {
    expect.assertions(1);
    const exampleBody = {
      ...validBody,
      assetClassAllocation: [
        { assetClass: 'INVALID', percentOfPortfolio: '3.5', included: true },
      ],
    };
    const exampleDto = plainToInstance(
      ConnectPortfolioSummaryRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(0);
  });
});
