# FE CSS Framework ADR (Architecture Decision Record)

## Status

Accepted

## Context

We need to decide on a CSS framework to use for building a design system. We want a framework that will help us maintain consistency in our UI and provide reusable components.

Other key requirements:
- Open source
- Well documented & well supported
- Consistent & accessible

## Decision

We have decided to use [Material-UI](https://mui.com).

## Rationale

### Design Language

Material-UI is built based on the well-established Material Design system created by Google. Thus it provides a consistent design system that can help us maintain a cohesive look and feel throughout the application.

### Community Support

Material-UI has a large and active community of developers who contribute to the framework and provide support.

### Accessibility

Material-UI provides built-in accessibility features that will help us ensure our application is accessible to all users.

### Time-to-Market

Material-UI provides a large number of pre-built components that we can use to build our application quickly. This will help us get to market faster.

### Familiarity

Since the move to ReactJS as our frontend library, we have been using Material-UI for our UI components. This means that we are already familiar with the framework and can leverage our existing knowledge to build our application.

## Other Candidates

- [TailwindCSS](https://tailwindcss.com) + Headless components (e.g [headless-ui](https://headlessui.com), [@radix-ui](https://www.radix-ui.com))
- [Mantine](https://mantine.dev)

## Consequences

Using Material-UI as our CSS framework means that we will need to learn and adhere to the framework's guidelines and design language. Additionally, if we decide to customize the pre-built components, we will need to carefully consider the impact on the application's performance and maintainability. 

However, we believe that the benefits of using Material-UI outweigh the potential drawbacks, and we are confident that it will help us build a better user experience.
