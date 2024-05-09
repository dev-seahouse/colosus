## Keycloak

## Questions Checklist

- [ ] Qn (document ans): Is it feasible to send OTP via Keycloak? (requires ability to customize branding of OTP sent)
- [ ] Qn: does toggling forget pwd functionality & allow user registration functionality in the admin console do anything wrt API/http ability to perform these actions?
- [ ] Qn: have I documented my findings today?
- [ ] Qn: does browser auth flow affect HTTP API auth flow? (c.f. Keycloak server admin documentation for what is meant by `auth flow`)
- [ ] Qn: is it possible to use KC as an identity broker via the HTTP API?
- [ ] Qn: how do I use HTTP API to obtain _identity token & access token_ and use those to access microservices on the colossus platform?
	- [ ] Partial ans: OIDC.
	- [ ] Qn: how can I invalidate tokens?
		- [ ] Partial anss: see "client credentials grant", see "client initiated backcannel authentication grant" (CIBA policy)
- [ ] Qn: Investors when they are onboarded are unauthenticated. How do we:
	- [ ] Persist their progress?
	- [ ] Prevent abuse of resources/DDOS
- [x] Qn: How do I create a "realm admin"?
	- [x] Relevant: On the admin console, go to Clients, see the 'realm-management' client, view permissions of that client
		- [x] Relevant: check the Ch 5. "giving user the delete-role" section in KC server admin docs
- [ ] Qn: How do I create an advisor? Programmatically?
- [ ] Qn: How do I create an investor? Programmatically?
- [ ] Qn: How do I represent the initial tenant?
	- [ ] Previous Ans: As a user with Advisor, Bambu-Admin, and RIA-Admin roles. For now, both Bambu-Admin and RIA-Admin have the same KC permissions.
	- [ ] Current Ans: As a user under the Advisor group. Admin-like accesses are mediated with admin credentials stored on the platform.
- [x] Qn: if a realm role has realm admin permissions, does this mean that all client s logged into a user w/ that role can mutate realm? or is it possible for a client to have few permissions and hence the admin can't mutate realm via that client?
	- [x] That is, is what a HTTP API call able to do the conjunction of realm role permissions and client role permissions or the disjunction?
	- [x] The concepts of realm roles and client roles are distinct, and has been documented.
- [ ] How do I set up a dummy email server for testing (KC emails)?
- [ ] Qn: How might I integrate social login to the admin/customer role separation?
	- [ ] Partial ans: LDAP mappers can map to groups. see [Mapping claims and assertions](https://www.keycloak.org/docs/latest/server_admin/#_mappers).
- [ ] Qn: How does `userManagedAccessAllowed` property of a realm affect our ability to create users for a realm without first being authenticated as e.g. an admin?

## Additional Notes

- [ ] Separation of identity & security access info & biz reasons for platform access
- [ ] Document limitation: unable to search for all federated users. One must sync federated users to KC?
- [ ] Document: reCAPTCHA integration for rate limiting?
	- [ ] Document that we instead choose to use rate-limiting on gateway?
- [ ] Document procedure on changing initial setup and especially realm definitions
	- [ ] (viz. modifying the setup JSON)
- [ ] Document: Local Authentication / Identity federation when using KC as an identity broker
- [ ] Document: limitation of stale access tokens issued by KC
	- [ ] Consider: invalidating token on auth server & using auth server to handle request of new token after identity is updated
	- [ ] Consider: not-before revocation policy
- [ ] Document: user migration for public realm
