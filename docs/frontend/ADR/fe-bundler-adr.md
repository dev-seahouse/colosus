# FE Bundler ADR ADR (Architecture Decision Record)

## Status

Accepted

## Context

We have been using Webpack as a build tool for our projects. While Webpack has served us well, we have noticed that the build times can be slow, especially for larger projects with complex dependencies. We are looking for a more modern and faster alternative that can improve our development workflow.


## Decision

We have decided to use [Vite](https://vitejs.dev).

## Rationale

- Faster build times (tallies with our development philosophy `Focus and speed`)
- Simple configuration system

## Consequences

We will need to ensure that our developers are trained and familiar with Vite. 

Overall, we believe that adopting Vite as our build tool for frontend development is a positive step that will bring significant benefits to our team and projects.

