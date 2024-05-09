# Frontend Unit Test Guidelines

## Introduction

The goal of unit tests is to provide a safety net for developers to make changes to the codebase without breaking existing functionality.

This document describes the guidelines for writing unit tests for the frontend codebase.

Unit test is done using [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro).

## General Guidelines

### Focus On Quality, Not Coverage

> Write tests. Not too many. Mostly integration.
>
> -- <cite>Guillermo Rauch</cite>

Coverage can often give false sense of security, having 100% coverage doesn't mean that the code is bug-free. It is important to write tests that are meaningful and verify the behavior of the code.

Learn More:
- [Kent C. Dodds - Write Tests](https://kentcdodds.com/blog/write-tests)

## Implementation Guidelines

### Use [@bambu/react-test-utils](../../../libs/frontend/react-test-utils/README.md) Wrapper to import your test function

Import `@testing-library/react` and `@testing-library/user-event` functions from `@bambu/react-test-utils` wrapper for consistency.

### Use `describe` and `it` blocks

Use `describe` and `it` blocks to group your tests. This makes it easier to read and understand the tests.

```typescript
describe('LoginForm', () => {
  it('should allow user to log in if credentials provided is correct', () => {
    // ...
  })
})
```

### Use @testing-library/user-event to Simulate User Interaction

Use `@testing-library/user-event` (exported as `userEvent` by [@bambu/react-test-utils](../../../libs/frontend/react-test-utils/README.md)) to test a flow since it provides a more realistic way of simulating user interaction.

The alternative, `fireEvent`, may yield a false positive scenario in certain cases.

```typescript
const Button = ({onClick}) => <button onClick={onClick} disabled>Click Me</button>;

// this test will pass, and it's wrong
it('calls onClick prop when clicked', async () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick} />);
  
  fireEvent.click(screen.getByRole('button'));
  
  expect(handleClick).toHaveBeenCalledTimes(1)
});

// this test will fail, as it should
it('calls onClick prop when clicked', async () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick} />);

  await userEvent.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```
