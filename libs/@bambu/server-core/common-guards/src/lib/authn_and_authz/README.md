# `authn_and_authz`

How to use:

- Put the guards globally as in

```
@Module({
  imports: [
    ...
  ],
  providers: [
    // Global guards are executed in order that they appear in this list
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleAuthorizationGuard,
    },
  ],
})
export class AppModule {}
```

- The `AuthenticationGuard` rejects every request that has an invalid bearer token. It allows requests that have no bearer token as well as requests with valid bearer tokens. It relies on some IAM services to retrieve an appropriate certificate to verify the bearer token. If a valid token accompanies the request, parsed token information is attached to the request as metadata. This information is required for `RoleAuthorizationGuard` to recognize authenticated users.
- The `RoleAuthorizationGuard` must be called only after the `AuthenticationGuard` is executed (in the order of processing incoming requests) so that it has appropriate metadata required for `RoleAuthorizationGuard` to work correctly. (Otherwise it will assume everyone is unauthenticated.) Only endpoints decorated with `@Public` are accessible to unauthenticated users.
- The `@Public()` decorator indicated that an endpoint should be accessible to unautheticated users.
- Undecorated endpoints are inaccessible, so that we err on the side of caution.
- Endpoints decorated by `@Authenticated()` are accessible to any authenticated user.
- Endpoints decorated by `@Role()` are inaccessible.
- Endpoints decorated by `@Role(["Role1", "Role2"])` are accessible to users possessing `Role1` as well as users possessing `Role2` users.
- There is currently no mechanism to allow access of an endpoint only to users who possess a conjunction of roles.
- Endpoints decorated by `@Authenticated()` or `@Role(...)` can be additionally decorated by `@AllowUnverifiedEmail()` (either on the handler or on the controller). If such a decorator is present, these endpoints are accessible even without a valid email.
- While it is an error to provide multiple of these decorators, we nevertheless assume `@Role(...)` supercedes `@Authenticated` supercedes `@Public` if only one of each is provided.
- Any of the `@Public()`, `@Authenticated()`, `@Role(...)` decorators on the method level supercede class-level decorators