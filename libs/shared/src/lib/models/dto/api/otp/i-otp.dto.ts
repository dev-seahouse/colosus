import { IOtpMetadataDto } from './i-otp-metadata.dto';

export interface IOtpDto extends IOtpMetadataDto {
  otp: string;
}
