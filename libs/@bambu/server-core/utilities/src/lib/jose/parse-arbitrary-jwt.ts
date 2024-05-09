import { JWTPayload, decodeJwt } from 'jose';

// We define this function instead of using decodeJwt directly for clarity in naming
export function parseArbitraryJWT<T extends JWTPayload>(jwt: string): T {
  return decodeJwt(jwt) as T;
}
