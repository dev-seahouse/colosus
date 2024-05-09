# FE E2E Test Framework ADR (Architecture Decision Record)

## Status

Accepted

## Context

We need to decide on an e2e test framework to use for our frontend application(s). We want a framework that will help us write reliable tests and that are easy to maintain.

## Decision

We have decided to use [Playwright](https://playwright.dev).

## Rationale

### Cross-Browser Compatibility

Playwright is a cross-browser testing tool that supports Chromium, Firefox, and WebKit. This means that we can run our tests on all three browsers and ensure that our application works as expected on all of them.

### Ease of Use

Playwright provides a simple robust, jest-like API that is easy to learn and use. It also provides a built-in test runner that makes it easy to run our tests.

### Trace Viewer

Playwright provides a trace viewer that allows us to view the browser's network activity and DOM tree during the test run, also options to enable screenshot & video trace. 

This will help us debug our tests and identify the root cause of any failures.

### Codegen

Playwright provides a codegen tool that allows us to record our interactions with the browser and generate a test script from it. This will help us write our tests faster.

## Other Candidates

- [Cypress](https://www.cypress.io)

## Consequences

We will need to ensure that all members of our development team are familiar with Playwright and its best practices. 

Additionally, we may need to customize the tool to fit our specific needs, which can add additional complexity. 

However, we believe that the benefits of using Playwright outweigh these potential concerns, and we are confident that it is the best choice for our project.
