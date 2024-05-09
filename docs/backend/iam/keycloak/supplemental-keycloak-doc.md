# Supplemental Keycloak Documentation

This file contains notes on Keycloak that is not sufficiently explained in the [Keycloak Server Administration Guide](https://www.keycloak.org/docs/latest/server_admin/index.html)

## Roles, Realm Roles, Client Roles, Clients

### Motivation for Clients

Use case: A company has two products ProductA and ProductB, and wants to centralize identity management for both products on Keycloak. However, when a user obtains an tokens to access ProductA, we do not want this token to simultaneously grant access to ProductB. To support this use case, when a user authenticates themself against Keycloak, they must supply a `client_id`; the tokens given allow actions to the user's _role_ with respect to the _client_ identified by that `client_id`. Hence a user may have e.g. moderator privileges with respect to ProductA, but the tokens that give the user access to moderator privileges in ProductA give the user no access to any functionality in ProductB.

### Default Roles

https://wjw465150.gitbooks.io/keycloak-documentation/content/server_admin/topics/roles/user-role-mappings/default-roles.html says

> Default roles allow you to automatically assign user role mappings when any user is newly created or imported through User Federation or Identity Brokering.

When a realm is created, among the multiple roles automatically set up, a composite realm role `default-roles-<realm_name>` is set up as well. Presumably, users imported through User Federation or Identity Brokering have `default-roles-<realm_name>` assigned to them. With the Admin web UI, or when creating users with the REST API, users created have `default-roles-<realm_name>` assigned to them. When importing a realm, users 'imported' do not have `default-roles-<realm_name>` assigned to them if not specified in the `UserRepresentation`.

### Default, distinguished clients and roles

When a realm is created, several `client`s and roles are registered automatically. It seems like Keycloak controls authorization to Keycloak APIs through these roles, so that these roles have special meaning for Keycloak. The roles under the `account` client control a user's ability to modify their personal data on Keycloak, whereas the roles under the `realm-management` client control a user's ability to perform realm management actions. Note that these roles are not well-documented, and I don't even know if these roles are inherently special or if they can create custom roles that are treated specially by keycloak as well. Note that there is a preview feature, "fine-grained permissions", that seem to give better and clearer authorization control wrt the Keycloak service.

### Juggling clients when interacting with Keycloak; or the necessity of the admin user

On Colossus, we strongly desire the following constraint:

> Each FE app manages credentials wrt only one client at a time throughout the entirety of its session. Changing credentials are OK, though STRONGLY discouraged and must be kept to an absolute minimum.

For this reason, we ultimately need to use the admin account or at least a service account to perform some user-initiated actions on Keycloak.

- For example, in Connect, we want to migrate an admin user from the `colossus-public` realm to their own tenant realm after we have an id for the tenant realm.
  - When we do so, we
    - Need to be an admin account to create a new realm.
    - Want to serve credentials for the newly migrated account to the FE without requiring the user to authenticate again. To do so we need to impersonate as this new user from being the admin account, or at least as a service account.

In addition, advisors need to perform the following actions on keycloak:

- Advisors need to manage their customers' access to the platform
- Advisors have data needs regarding their customers' personal/contact information
- Advisors have data needs regarding their customers' access to the platform

Also, investors need to be able to correct their own personal information and change their credentials.

For these needs to interact with Keycloak, along with the requirement to maintain credentials for one client only, we prefer that the credentials we serve to the FE be a client that has special meaning in KC, namely, `account`, or `realm-management`, rather than a client specifically for colossus.

- Alternative proposal not pursued: users log into a custom client, and then Colossus (using a service role... ?) impersonates the user with the appropriate client for performing the desired action on the Keycloak service.

Hence the clients involved should be generally the following:
- Unauthenticated advisors and investors use the `account` client and `publicuser` user in `colossus-public`.
- Authenticated investors not assigned to a realm use the `account` client, as their own user, in `colossus-public`.
- Authenticated users using the investor FE app use the `account` client, as their own user, in their advisor/RIA's tenant realm.
- Authenticated users (advisors/RIAs) using the admin app use the `realm-management` client, as their own user, in their own tenant realm.
- Authenticated admins using the admin app use the `realm-management` client, as their own user, in their own tenant realm.
- The Colossus app maintains credentials to the admin user / service accounts to perform actions against keycloak in behalf of these users that their tokens fail to allow.
  - Such actions are mediated by a "high-risk" module that 

### Important Issue and Workaround

- Apparently the `realm-management` role doesn't support "direct access grant" as expected. Workaround: use the admin role

## References

* https://stackoverflow.com/a/47857926/2139851