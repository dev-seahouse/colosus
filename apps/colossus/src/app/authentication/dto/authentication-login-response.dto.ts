import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { AuthenticationDto } from '@bambu/shared';

export class AuthenticationLoginResponseDto
  implements AuthenticationDto.IAuthenticationLoginResponseDto
{
  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJsdGhRcl9tdS00Y1dnM0taX1NBcG5TRGtoNjVSTk1vR29oX2JQRk5NcXlrIn0.eyJleHAiOjE2NzgzNDc2MTksImlhdCI6MTY3ODM0NzMxOSwianRpIjoiYjFjMTViMGMtYWNmMy00NzRlLTk4MTUtNTc1YTU0NWZkYWU4IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9jb2xvc3N1cy1wdWJsaWMiLCJzdWIiOiIyZTZlYTIyMy01ZmY1LTQ1MzYtYjMxMS1iZTRlZThkOGVlODYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhY2NvdW50Iiwic2Vzc2lvbl9zdGF0ZSI6ImJlYWRhMWFhLWRjZGMtNDg0My1iNjVhLTI2MTJjMWRlNzEyNyIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiR3Vlc3QiXX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6ImJlYWRhMWFhLWRjZGMtNDg0My1iNjVhLTI2MTJjMWRlNzEyNyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZ3JvdXBzIjpbIkd1ZXN0Il0sInByZWZlcnJlZF91c2VybmFtZSI6InB1YmxpY3VzZXIifQ.lVNcpgEUcgfn0KOjMjdpDplUeVvzbGBT_9H8BjfKTWbHg9koOsIKynVYttLSI1QdQ1iTjEYSoGxBQ-FlBTIEmF8COY3W0aVWfcsMurSkfoINA3A7VgwBKSfP9lsvX3Q5PYMHtCWcPEoo-ddJ7YIP_Syz2V6e1qPygofgBihMe4eYmC27u4oX98YhXoPJTfAaZNBiKA61dDvc99OTrgcAiqMh3Gr5xRGokWJKd41PLWnUpYxfmMvgMXyN0C5jQWAEweYGJ16E8oHebziePyZRQmG-1ymuSegzHv24Hn00G--UFqe6K_SG0KuTYT6iYCL3CBd9evsbeuEbIcK1uddv0A',
    description: [
      "JWT representing the access token. The access token is used to authorize requests to the API's microservices.",
      'The example token decodes to the following header and payload:\n',
      'Header:',
      `
    {
      "alg": "RS256",
      "typ": "JWT",
      "kid": "lthQr_mu-4cWg3KZ_SApnSDkh65RNMoGoh_bPFNMqyk"
    }
      `,
      'Payload:',
      `
    {
      "exp": 1678347619,
      "iat": 1678347319,
      "jti": "b1c15b0c-acf3-474e-9815-575a545fdae8",
      "iss": "http://localhost:8080/realms/colossus-public",
      "sub": "2e6ea223-5ff5-4536-b311-be4ee8d8ee86",
      "typ": "Bearer",
      "azp": "account",
      "session_state": "beada1aa-dcdc-4843-b65a-2612c1de7127",
      "acr": "1",
      "realm_access": {
        "roles": [
          "Guest"
        ]
      },
      "scope": "email profile",
      "sid": "beada1aa-dcdc-4843-b65a-2612c1de7127",
      "email_verified": false,
      "groups": [
        "Guest"
      ],
      "preferred_username": "publicuser"
    }
      `,
    ].join('\n'),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  access_token: string;

  @ApiProperty({
    type: 'integer',
    example: '300',
    description: 'The lifetime in seconds of the access token.',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  expires_in: number;

  @ApiProperty({
    type: 'integer',
    example: '1800',
    description: 'The lifetime in seconds of the refresh token.',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  refresh_expires_in: number;

  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhOWJhYjAyNC1mYjA0LTRlNTYtYWMyYy1kOGJiMjEyODQ1Y2YifQ.eyJleHAiOjE2NzgzNDg4NjYsImlhdCI6MTY3ODM0NzA2NiwianRpIjoiYzdjNmQ1OTAtMWNjNS00YjUyLWE3ZjQtMzAzZTUzMDZiMzlkIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9jb2xvc3N1cy1wdWJsaWMiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvcmVhbG1zL2NvbG9zc3VzLXB1YmxpYyIsInN1YiI6IjJlNmVhMjIzLTVmZjUtNDUzNi1iMzExLWJlNGVlOGQ4ZWU4NiIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJhY2NvdW50Iiwic2Vzc2lvbl9zdGF0ZSI6IjUxZmMzZDhkLTllNTQtNDRkNi1iMjI5LWExODI3OGZmYzFiMSIsInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6IjUxZmMzZDhkLTllNTQtNDRkNi1iMjI5LWExODI3OGZmYzFiMSJ9.C3og1c2-Ren_9gvCC-TSjTOACLCIymuz38dgji4Htow',
    description: [
      'JWT representing the refresh token. The refresh token is used to obtain new access tokens and refresh tokens (?) when the current access token expires. TODO(endpoint for refreshing)',
      'The example token decodes to the following header and payload:\n',
      'Header:',
      `
    {
      "alg": "HS256",
      "typ": "JWT",
      "kid": "a9bab024-fb04-4e56-ac2c-d8bb212845cf"
    }
      `,
      'Payload:',
      `
    {
      "exp": 1678348866,
      "iat": 1678347066,
      "jti": "c7c6d590-1cc5-4b52-a7f4-303e5306b39d",
      "iss": "http://localhost:8080/realms/colossus-public",
      "aud": "http://localhost:8080/realms/colossus-public",
      "sub": "2e6ea223-5ff5-4536-b311-be4ee8d8ee86",
      "typ": "Refresh",
      "azp": "account",
      "session_state": "51fc3d8d-9e54-44d6-b229-a18278ffc1b1",
      "scope": "email profile",
      "sid": "51fc3d8d-9e54-44d6-b229-a18278ffc1b1"
    }
      `,
    ].join('\n'),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  refresh_token: string;

  @ApiProperty({
    type: 'string',
    example: 'Bearer',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  token_type: string;

  @ApiProperty({
    type: 'integer',
    example: '0',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  'not-before-policy': number;

  @ApiProperty({
    type: 'uuid',
    example: 'Bearer',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  session_state: string;
}
