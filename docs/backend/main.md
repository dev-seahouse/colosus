TODO: organize
- [ ] IAM -- full-featured (c.f. Tango)
	- [ ] Recall KC API
	- [ ] Separate customer business admin concerns from customer access admin concerns
	- [ ] (gateway: platform tyk API gateway)
	- [ ] Post-Office Model (CQRS in a monolith) (not being considered rn awaiting architecting a queue)
		- [ ] Aggregate layer
	- [ ] SOP needs to discuss about when documentation needs to be associated with the PR
	- [ ] Code organization README.md
	- [ ] Really good documentation
	- [ ] Reusable middleware
- [ ] develop proper SOP workarounds for ERR_REQUIRE_ESM (i.e. depending on pure esm libs)

- NestJS's `ConfigService` seems like it merges configurations. Please namespace your configs.