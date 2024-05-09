import { JWK } from 'jose';

export interface ICertsResponseDto {
  keys: JWK[];
}
