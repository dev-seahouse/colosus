// noinspection ES6PreferShortImport
// https://stackoverflow.com/questions/58843038/how-to-manually-test-input-validation-with-nestjs-and-class-validator

import { plainToInstance } from 'class-transformer';
import { AuthenticationRefreshRequestDto } from './authentication-refresh-request.dto';
import { validate } from 'class-validator';

describe('AuthenticationRefreshRequestDto', () => {
  it('should have well-formed bodies pass validation', async () => {
    expect.assertions(1);
    const exampleBody = {
      refresh_token: 'refresh_token_value',
    };
    const exampleDto = plainToInstance(
      AuthenticationRefreshRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(0);
  });
  it('should reject improperly capitalized `refresh_token`', async () => {
    expect.assertions(2);
    const exampleBody = { refreshToken: 'refresh_token_value' };

    const exampleDto = plainToInstance(
      AuthenticationRefreshRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toHaveProperty('constraints.isNotEmpty');
  });
  it('should reject empty string `refresh_token`', async () => {
    expect.assertions(2);
    const exampleBody = { refresh_token: '' };

    const exampleDto = plainToInstance(
      AuthenticationRefreshRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toHaveProperty('constraints.isNotEmpty');
  });
});
