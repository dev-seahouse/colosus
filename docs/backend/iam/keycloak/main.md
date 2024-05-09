# Keycloak

See https://www.keycloak.org/docs/latest/server_admin/index.html for Keycloak concepts and terminology.

## Additional terminlogy

- __Corporate clients__, or __clients__, or __RIAs__ (Registered Investment Advisor) (preferred?) are financial institutions who are the primary customers of Bambu.
- __Vendee-Admins__ are usually people/roles designated by RIAs to manage the RIA's account(s) on Bambu platforms.
- __Vendor-Admins__ are roles for employees of Bambu to manage the platform on Bambu's behalf, or on behalf of RIAs/Advisors/Investors.
- __Advisors__ are employees of __RIAs__ and are the primary point of contact of Investors, who are the RIAs' customers. Each advisor typically manages the portfolios of several investors.
- __Investors__ (preferred), or __end users__, or __end customers__ are the customers of RIAs. They always belong to the `Default Advisor Group` or one of the custom `Advisor Group`s.
- A __Tenant realm__ is any realm that is not `master` or `colossus-public`.

## Common Hierarchy

- Except for the default roles, we do not assign roles directly to users, but assign them to groups and assign groups to users.
- There are roles for `Vendee-Admin`s, `Vendor-Admin`s, `Advisor`s, `Investor`s, `Guest`s. There are groups corresponding exactly to these roles.
  - `Vendee-Admin` This is the role granting permissions to users that the platform's procurers have designated to administer their usage of the platform.
  - `Vendor-Admin` This is the role granting permissions to users that the vendor have designated to administer the platform.
  - `Advisor` This is the role granting permissions to advisors.
  - `Investor` This is the role granting permissions to investors.
  - `Guest` This is the role granting permissions to users that have not identified themselves.
- There is a `Default Advisor Group` that is assigned to investors who have not been assigned an advisor group. Investors that have been assigned to an advisor group should not be in this group.

## Connect Simplifications/Specializations

- The platform contains `N+2` realms, where
  - `N` is between the number of Advisors that have begun onboarding and been onboarded onto the platform
  - The remaining `2` realms are `colossus-public` and `master`.
- There is only the `publicuser` user in the `colossus-public` realm. The `publicuser` user has the `Guest` role and is used to provide access to Colossus microservices to unauthenticated users. Progression is stored FE client-side up to the point of providing a username and password, upon which a realm is created for the Advisor.
- There is always exactly one user in the `Advisors` group of a tenant realm.
- There are zero or more users in the `Investors` group of a tenant realm.
- There are no custom `Advisor Group`s. Each Investor user is assigned to the `Default Advisor Group` upon creation by Colossus.

## Transact Simplifications/Specializations

- The platform contains `N+2` realms, where
  - `N` is between the number of RIAs that have begun onboarding and been onboarded onto the platform
  - The remaining `2` realms are `colossus-public` and `master`.
- In addition to the `publicuser` user in the `colossus-public` realm, there are an indefinite number of Investor users in the `colossus-public` realm.
- TODO (not determined yet)

## Keycloak hierarchy

- Only the realm initialization call to KC uses the master user (TODO: use an admin user that can only create realms)
- All further configuration must use the realm admin.

Composite Roles are similar to Groups as they provide the same functionality. The difference between them is conceptual. Composite roles apply the permission model to a set of services and applications. Use composite roles to manage applications and services.

Groups focus on collections of users and their roles in an organization. Use groups to manage users.

https://www.keycloak.org/docs/latest/server_admin/
