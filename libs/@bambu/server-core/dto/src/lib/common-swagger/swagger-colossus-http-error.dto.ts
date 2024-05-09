import { ApiProperty } from '@nestjs/swagger';
import { SharedEnums } from '@bambu/shared';

const allErrorCodes: string[] = [];

allErrorCodes.push(
  ...Object.values(SharedEnums.ErrorCodes.GenericErrorCodesEnum)
);
allErrorCodes.push(
  ...Object.values(SharedEnums.ErrorCodes.StripeIntegrationErrorCodesEnum)
);

export class SwaggerColossusHttpErrorDto {
  @ApiProperty({
    example: 'Error',
    description: 'Error type.',
    required: true,
    type: 'string',
  })
  error: string;

  @ApiProperty({
    example: SharedEnums.ErrorCodes.GenericErrorCodesEnum.UNHANDLED,
    required: true,
    description: 'Error code from Bambu GO Colossus platform.',
    enum: allErrorCodes,
    type: 'string',
  })
  errorCode: string;

  @ApiProperty({
    example: 500,
    required: true,
    description: 'HTTP error code. Code range from 400 to 599.',
    type: 'integer',
    externalDocs: {
      description: 'HTTP Error code listing. Code range from 400 to 599.',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status',
    },
  })
  statusCode: number;

  @ApiProperty({
    example: 'Unhandled exception.',
    required: true,
    description: 'Error message.',
    type: 'string',
  })
  message: string;

  @ApiProperty({
    example: 'acfa95b3-eb17-40a4-b75c-53dc5f940ea4',
    required: true,
    description: 'API request id.',
    type: 'string',
  })
  requestId: string;
}
