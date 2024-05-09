// noinspection ES6PreferShortImport
// https://stackoverflow.com/questions/58843038/how-to-manually-test-input-validation-with-nestjs-and-class-validator

import { plainToInstance } from 'class-transformer';
import { AccountInitialEmailVerificationRequestDto } from './account-initial-email-verification-request.dto';
import { validate } from 'class-validator';

describe('AccountInitialEmailVerificationRequestDto', () => {
  it('should have well-formed bodies pass validation', async () => {
    expect.assertions(1);
    const exampleBody = {
      tenantName: 'foo_eggs_at_bar_com',
      username: 'foo.eggs@bar.com',
      otp: '902832',
    };
    const exampleDto = plainToInstance(
      AccountInitialEmailVerificationRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(0);
  });
  it('should reject empty strings in fields', async () => {
    expect.assertions(6);
    const correctBody = {
      tenantName: 'foo_eggs_at_bar_com',
      username: 'foo.eggs@bar.com',
      otp: '902832',
    };
    for (const field of ['tenantName', 'username', 'otp']) {
      const exampleBody = { ...correctBody, [field]: '' };

      const exampleDto = plainToInstance(
        AccountInitialEmailVerificationRequestDto,
        exampleBody
      );
      const errors = await validate(exampleDto);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toHaveProperty('constraints.isNotEmpty');
    }
  });
});
