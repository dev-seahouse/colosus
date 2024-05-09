# Contributing

## Getting started

Before contributing, do make sure that you have fulfilled [pre-requisites](../../../README.md) for the project.

## Folder Structure

```
src/
  |- libs/
  | |- ApiLibraryApi
  | | |- <API library API>
  | |- stores/
  | | |- <zustand-based API store>
  | |- utils/
  | | |- <global level API utilities>
```

## Development

### API Reference

The API reference is generated using [Swagger](https://swagger.io/) and maintained by the Backend team.

In order to start the API reference locally, you need to serve colossus app via nx console or run `yarn nx run colossus:serve`
command from the root of the project.

Once the colossus server is running, you can access the API reference at [http://localhost:9000/openapi](http://localhost:9000/openapi).

### Shared Types

The shared types are maintained by the Backend team and are available as part of [@bambu/shared](../../shared/README.md) package.

Normally, you can import the shared types like this:

```typescript
import type { ISharedType } from '@bambu/shared';
```
