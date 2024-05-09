// noinspection ES6PreferShortImport
// https://stackoverflow.com/questions/58843038/how-to-manually-test-input-validation-with-nestjs-and-class-validator

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ConnectAdvisorAccountInitialEmailVerificationRequestDto } from './connect-advisor-initial-email-verification-request.dto';

describe('ConnectAdvisorResendInitialVerificationOtpRequestDto', () => {
  it('should have well-formed bodies pass validation', async () => {
    expect.assertions(1);
    const exampleBody = {
      username: 'foo@bar.com',
      otp: '123456',
    };
    const exampleDto = plainToInstance(
      ConnectAdvisorAccountInitialEmailVerificationRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(0);
  });
  it('should reject non-email `username`', async () => {
    expect.assertions(2);
    const exampleBody = {
      username: 'foo',
      otp: '123456',
    };

    const exampleDto = plainToInstance(
      ConnectAdvisorAccountInitialEmailVerificationRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toHaveProperty('constraints.isEmail');
  });
  it('should reject missing `username`', async () => {
    expect.assertions(2);
    const exampleBody = {
      otp: '123456',
    };

    const exampleDto = plainToInstance(
      ConnectAdvisorAccountInitialEmailVerificationRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toHaveProperty('constraints.isEmail');
  });
});
