export interface IServerCoreIamClaimsDto {
  iss: string;
  sub: string; // same as user id
  realm: string; // same ass application id
  roles: string[];
  // sid: string;
  email_verified: boolean;
  preferred_username: string;
  email: string;
  // begin fusionauth specific
  tid: string; // same as tenant id
  // begin keycloak specific
  // realm_access: {
  //   roles: string[];
  // };
  // azp: string;
  // session_state: string;
  // acr: string;
  // typ: string;
  // scope: string;
  // end keycloak specific
}
