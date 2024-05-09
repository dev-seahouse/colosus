import { decodeJwt } from 'jose';

export const getUserIdFromJwt = (jwt: string) => {
  const { sub } = decodeJwt(jwt);

  return sub ?? '';
};

export default getUserIdFromJwt;
