import { ITransactAdvisorBankAccountMutableForApiDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';

export class TenantTransactBankAccountMutableDto
  implements ITransactAdvisorBankAccountMutableForApiDto
{
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'Wealth Avenue LLC',
    description:
      'This should match the name that appears on your company bank acoount',
  })
  accountName: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '12345678',
    description: 'Your company bank account number',
  })
  accountNumber: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '123456',
    description: 'Six digit number that identifies your bank',
  })
  sortCode: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '5',
    description:
      'A percentage of the total assets under management (AUM), as annual fee',
  })
  annualManagementFee: string;
}

export class TenantTransactBankAccountDto extends TenantTransactBankAccountMutableDto {
  @ApiProperty({
    type: 'string',
    example: '1ff7d3f7-8683-435c-8a30-d45183322e0a',
    description: 'Uuid for bank account record',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    example: '1ff7d3f7-8683-435c-8a30-d45183322e0a',
    required: true,
  })
  tenantId: string;
}
