import { IColossusUserOtpRequestDto } from '../i-colossus-user-otp-request.dto';

// Not happy with the shape of this
export interface IConnectAdvisorAccountInitialEmailVerificationRequestDto
  extends IColossusUserOtpRequestDto {
  refresh_token?: string;
}
