import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class ColossusGoalTransactionsQueryParamsDto extends BrokerageIntegrationServerDto.BrokerageIntegrationTransactionsListAllQueryParamsDto {
  @ApiHideProperty()
  @ApiProperty({
    required: false,
    type: String,
    description:
      'DO NOT USE. It will be overwritten by the backend. This is here due to some weirdness with Nest.JS.',
  })
  portfolioId?: undefined;
}
