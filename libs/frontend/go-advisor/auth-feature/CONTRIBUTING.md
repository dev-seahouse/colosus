# Contributing

## Getting started

Before contributing, do make sure that you have fulfilled [pre-requisites](../../../README.md) for the project.

## Folder Structure

``` 
src/
  |- lib/
  | |- components
  | | |- <Auth flow related components/atoms>
  | |- hooks/
  | | |- <Auth flow related hooks>
  | |- layouts/
  | | |- <Common layouts used in Auth flow>
  | |- pages/
  | | |- <Auth flow related pages>
  | |- store/
  | | |- <Auth flow related store>
```

## Development

### Running Storybook

Using nx console, you can run the storybook for this library by clicking **tasks -> storybook -> go-advisor**.

Alternatively, you can run `yarn nx run go-advisor:storybook` command from the root of the project.

Once the storybook is running, you can access it at [http://localhost:4400](http://localhost:4400).

### Running Unit Tests

Using nx console, you can run the unit tests for this library by clicking **tasks -> test -> go-advisor-auth-feature**.

Alternatively, you can run `yarn nx run go-advisor-auth-feature:test` command from the root of the project.

### Life Pro Tips

There are a few things that you can do to make your life easier when working on this library:

- [Generating React component using nx console]()
- [Generating React stories using nx console]()

### FAQs
#### Why is storybook loading forever when running under windows wsl2?
This has to do how WSL handles file system that causes storybook's cache-manager to fail.
A temporary fix until upstream fix is `rm -rf node_modules/.cache/storybook`.

#### Why am i getting TypeError: Cannot destructure property 'basename' of 'React__namespace.useContext(...)' as it is null?
make sure to `import { render } from '@bambu/react-test-utils';` instead of `import { render } from '@testing-library/react';` in test files.


### Why do I get  Failed to start or connect to the Nx Daemon process error ?
close IDEs and git push again until upstream fix https://github.com/nrwl/nx/issues/12237.


