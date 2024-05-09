import { StripeIntegrationDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsDateString } from 'class-validator';
export class GetSubscriptionUpgradeDetailsResponseDto
  implements StripeIntegrationDto.IGetSubscriptionUpgradeDetailsResponseDto
{
  @ApiProperty({
    type: 'number',
    required: true,
    description: 'Cost to upgrade from Connect to Transact',
  })
  @IsNotEmpty()
  @IsBoolean()
  cost: number;

  @ApiProperty({
    description: 'next subscription start date',
    type: 'string',
    format: 'date',
    example: '2023-10-26',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;
}
