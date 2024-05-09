import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';
import { ApiProperty } from '@nestjs/swagger';

export class BrokerageAuthenticationTokenDto
  implements BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto
{
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2023-09-07T16:08:18.064Z',
    description: 'The date and time when the token was issued.',
  })
  inceptionDateIsoString: string;

  @ApiProperty({
    type: 'number',
    example: 3600,
    format: 'int32',
    description: 'The lifespan of the token in seconds.',
  })
  lifespanInSeconds: number;

  @ApiProperty({
    type: 'object',
    description: 'The raw data of the token.',
    example: {
      access_token:
        'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ0MUY0QzU0MzM2MjBGMjVFQkZDRjk4M0I0RjY4RDQ3Nzk0RTdENDlSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6IlJCOU1WRE5pRHlYcl9QbUR0UGFOUjNsT2ZVayJ9.eyJuYmYiOjE2OTQxMDI4OTcsImV4cCI6MTY5NDEwNjQ5NywiaXNzIjoiaHR0cHM6Ly9hdXRoLnNhbmRib3gud2VhbHRoa2VybmVsLmlvLyIsImF1ZCI6IndrLmdhdGV3YXkiLCJjbGllbnRfaWQiOiJhZDA1Y2FlZC0xMjc5LTQwYTctODM3My1mYzU1MDMwZTZmMWIiLCJ0aWQiOiJCYW1idSIsIm12ZXIiOiIyMDIxLTA1LTE3IiwianRpIjoiMTM5NDQxQzY4OUQxRjk3ODJGRDMyRDJDNjBENENFODYiLCJpYXQiOjE2OTQxMDI4OTcsInNjb3BlIjpbIndrLmdhdGV3YXkiXX0.ozgklP4aikQkCDsfVD4FDp1J5Xz6eJThgkqqHHP1BZGYA-cKQnsSvDp6An4jSdK0jZ87K8ctk90qCqiMgO4kUWtIQsM-kMUPLnwbiqdnci55ybjlbfh-64pT6XoNyr3cEZcTLdg8yZg2bWI6XCBbyhD52Cz6siyC6Eo3R8NVFTsfz40VfXhE2GW4eil_noANt9e3y8AldYxrfpuT1JgQgMjnXNk2FtvUZhOEgsszynUOUl9KRoPTTh1vkQqPL156xtwXD8VF_uyYQKIZTJ7PZC6wMF_P8QdSN6XI1_UHB9x3bDKI_7jwts52USG2unYlNi4UI7P3nNmqyCeBwjh08w',
      expires_in: 3600,
      token_type: 'Bearer',
      scope: 'wk.gateway',
    },
  })
  rawData: Record<string, unknown>;

  @ApiProperty({
    type: 'string',
    example: 'wk.gateway',
    description: 'The scope of the token.',
  })
  scope: string;

  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ0MUY0QzU0MzM2MjBGMjVFQkZDRjk4M0I0RjY4RDQ3Nzk0RTdENDlSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6IlJCOU1WRE5pRHlYcl9QbUR0UGFOUjNsT2ZVayJ9.eyJuYmYiOjE2OTQxMDI4OTcsImV4cCI6MTY5NDEwNjQ5NywiaXNzIjoiaHR0cHM6Ly9hdXRoLnNhbmRib3gud2VhbHRoa2VybmVsLmlvLyIsImF1ZCI6IndrLmdhdGV3YXkiLCJjbGllbnRfaWQiOiJhZDA1Y2FlZC0xMjc5LTQwYTctODM3My1mYzU1MDMwZTZmMWIiLCJ0aWQiOiJCYW1idSIsIm12ZXIiOiIyMDIxLTA1LTE3IiwianRpIjoiMTM5NDQxQzY4OUQxRjk3ODJGRDMyRDJDNjBENENFODYiLCJpYXQiOjE2OTQxMDI4OTcsInNjb3BlIjpbIndrLmdhdGV3YXkiXX0.ozgklP4aikQkCDsfVD4FDp1J5Xz6eJThgkqqHHP1BZGYA-cKQnsSvDp6An4jSdK0jZ87K8ctk90qCqiMgO4kUWtIQsM-kMUPLnwbiqdnci55ybjlbfh-64pT6XoNyr3cEZcTLdg8yZg2bWI6XCBbyhD52Cz6siyC6Eo3R8NVFTsfz40VfXhE2GW4eil_noANt9e3y8AldYxrfpuT1JgQgMjnXNk2FtvUZhOEgsszynUOUl9KRoPTTh1vkQqPL156xtwXD8VF_uyYQKIZTJ7PZC6wMF_P8QdSN6XI1_UHB9x3bDKI_7jwts52USG2unYlNi4UI7P3nNmqyCeBwjh08w',
    description: 'The token.',
  })
  token: string;

  @ApiProperty({
    type: 'string',
    enum: BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenTypeEnum,
    example:
      BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenTypeEnum
        .BEARER,
    description: 'The type of the token.',
  })
  tokenType: BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenTypeEnum;
}
