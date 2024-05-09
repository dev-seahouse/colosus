// noinspection ES6PreferShortImport
// https://stackoverflow.com/questions/58843038/how-to-manually-test-input-validation-with-nestjs-and-class-validator

import { plainToInstance } from 'class-transformer';
import { ConnectAdvisorSendResetPasswordEmailOtpRequestDto } from './connect-advisor-send-reset-password-email-otp-request.dto';
import { validate } from 'class-validator';

describe('ConnectAdvisorResetPasswordRequestDto', () => {
  it('should have well-formed bodies pass validation', async () => {
    expect.assertions(1);
    const exampleBody = {
      email: 'foo.eggs@bar.com',
    };
    const exampleDto = plainToInstance(
      ConnectAdvisorSendResetPasswordEmailOtpRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(0);
  });
  it('should reject non-email `email`', async () => {
    expect.assertions(2);
    const exampleBody = { email: 'foo.eggs@bar' };

    const exampleDto = plainToInstance(
      ConnectAdvisorSendResetPasswordEmailOtpRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toHaveProperty('constraints.isEmail');
  });
  it('should reject missing `email`', async () => {
    expect.assertions(2);
    const exampleBody = {};

    const exampleDto = plainToInstance(
      ConnectAdvisorSendResetPasswordEmailOtpRequestDto,
      exampleBody
    );
    const errors = await validate(exampleDto);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toHaveProperty('constraints.isEmail');
  });
});
