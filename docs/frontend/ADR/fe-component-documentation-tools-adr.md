# FE Component Documentation Tools ADR (Architecture Decision Record)

## Status

Accepted

## Context

We are building a new design system that may contain a large number of complex UI components and currently looking towards the adoption of component driven development (CDD) as a way to build our application. 

As such, we need to decide on a component documentation tool that will help us document and showcase our components.

## Decision

We have decided to use [Storybook](https://storybook.js.org).

## Rationale

### Concise Documentation

Storybook provides a clear and concise way to document our UI components. We can easily showcase each component and its various states, which makes it easier for other members (technical and non-technical) of our team to understand how the components work.

### Interactive Testing

Storybook allows us to interactively test our components in various states. This makes it easier to catch bugs and errors early on in the development process, which can save us time and resources in the long run.

### Large Community and Ecosystem

There are many add-ons and plugins available that can help us extend the functionality of our component library.

### Integration with Other Tools

Storybook integrates with many other development tools, including GitHub, Travis CI, and various testing frameworks (e.g [Chromatic](https://www.chromatic.com)).

## Other Candidates

- [Styleguidist](https://react-styleguidist.js.org)
- [Bit](https://bit.dev)

## Consequences

Using Storybook for component documentation means that we will need to allocate additional time and resources to learn and implement the tool. 

We will also need to ensure that all members of our development team are familiar with Storybook and its best practices. 

Additionally, we may need to customize the tool to fit our specific needs, which can add additional complexity. 

However, we believe that the benefits of using Storybook outweigh these potential concerns, and we are confident that it is the best choice for our project.
