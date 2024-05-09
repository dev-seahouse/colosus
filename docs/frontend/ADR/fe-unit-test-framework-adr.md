# FE Unit Test Framework ADR (Architecture Decision Record)

## Status

Accepted

## Context

We need to decide on a unit test framework to use for our frontend application(s). 

We want a framework that will help us write reliable tests and that are easy to maintain.

## Decision

We have decided to use [Vitest](https://vitest.dev).

## Rationale

- Fast test execution times
- Seamless integration with Vite
- Simple configuration system

## Other Candidates

- [Jest](https://jestjs.io)

## Consequences

We may need to update our documentation and development standards to reflect the use of Vitest

Overall, we believe that using Vitest as our unit testing framework is a positive step that will bring significant benefits to our team and projects.
