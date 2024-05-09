# IAM

## Overview

The IAM functionality in the backend governs several concerns

- Registering a user on the platform
- Identifying a user of the platform
- Managing and restricting access to the platform to an identified user accessing the backend from a client
- Managing a user's access to the platform by an admin user
- Providing identifying information (primarily permissions) to the client and services (viz. tenant_id, roles, user_id)

## Frontend-Backend Session Communication

TODO(Johannes): This section is outdated and under revision.

Two tokens manage a user's session against the platform:

- A long-lived refresh token is granted when a user identifies themself against the authentication service
  - It is possible to identify as a public user for a tenant
- Using a valid refresh token, a user can obtain another refresh token.
  - Nice to have: refresh tokens are never invalidated. Access is controlled by not allowing users to obtain session tokens from it.
- Using a refresh token, a user can obtain a short-lived session token.
- It is with the session token that authorizes the user against the other backend services.

### Frontend Recommendations

TODO(Johannes): This section is outdated and under revision.

- Upon any request to the backend, check to see if the refresh token is close to expiry. If so, reobtain the refresh token and session token before the request.
  - Either request to reobtain tokens may fail.
- Upon any request to the backend, check to see if the session token is close to expiry. If so, reobtain the session token.
- If the backend rejects access with the reason being that the token has expired or invalidated, obtain a new session token.
  - The frontend should expect the session token to frequently be invalidated by the backend.

### Backend Implementation (tentative)

TODO(Johannes): This section is outdated and under revision.

- Requests to obtain refresh tokens and session tokens are handled by the authentication service
- Identity management: Identifying the user (in order to retrieve a refresh token) involves delegation to Keycloak
  - Requesting a refresh token may succeed even if a user's access to the platform is restricted or denied due to business reasons.
  - Failure to obtain a refresh token will primarily stem from security reasons.
- Access management: Requesting a session token using a refresh token should not involve Keycloak.
  - Requesting a session token may fail if access is denied for business reasons, or identity security reasons.
  - Session token invalidation may be redis-based.