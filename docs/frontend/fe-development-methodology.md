# Frontend Development Methodology

## Component-Driven Development (CDD)

Component Driven Development (CDD) is a software development approach where software is broken down into small, modular components, which are designed, developed, tested, and deployed independently of one another. These components can then be combined to create larger applications.

The idea behind CDD is to create a system that is easier to develop, test, and maintain by breaking it down into smaller, more manageable pieces. Each component has a well-defined interface and is responsible for performing a specific function. This makes it easier to reuse components across different projects and to test them in isolation, without having to test the entire system.

For this purpose, we use [Storybook](https://storybook.js.org),


## Micro-frontend (Kind of but not really)

Micro-frontend architecture is a software development approach that involves breaking down a frontend web application into smaller, independent and self-contained modules, called microfrontends. Each microfrontend represents a specific feature or functionality of the application and can be developed, tested, and deployed independently of the others.

We are trying to follow a _micro-frontend-esque_ approach, where the app is broken down into small modules called `features`. Each feature can be developed and tested independently, but it will be bundled together as part of the monolith frontend application during build time and won't be deployed separately.


## Additional Resources

- [Component-Driven Development](https://www.componentdriven.org/)
- [Chromatic - CDD](https://www.chromatic.com/blog/component-driven-development/)
- [Micro-frontend](https://martinfowler.com/articles/micro-frontends.html)
