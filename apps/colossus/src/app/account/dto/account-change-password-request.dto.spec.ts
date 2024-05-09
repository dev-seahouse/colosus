// noinspection ES6PreferShortImport
// https://stackoverflow.com/questions/58843038/how-to-manually-test-input-validation-with-nestjs-and-class-validator

import { plainToInstance } from 'class-transformer';
import { AccountChangePasswordRequestDto } from './account-change-password-request.dto';
import { validate } from 'class-validator';

describe('AccountChangePasswordRequestDto', () => {
  it('should have well-formed bodies pass validation', async () => {
    expect.assertions(1);
    const exampleBody = {
      newPassword: 'hunter3',
    };
    const exampleDto = plainToInstance(
      AccountChangePasswordRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(0);
  });
  it('should reject empty strings in newPassword', async () => {
    expect.assertions(2);
    const exampleBody = { newPassword: '' };

    const exampleDto = plainToInstance(
      AccountChangePasswordRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toHaveProperty('constraints.isNotEmpty');
  });
});
