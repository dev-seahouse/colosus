[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=frontend-api-client-old&metric=ncloc&token=73750ac968cd739da2de8b4d7b20df35786395d4)](https://sonarcloud.io/summary/new_code?id=frontend-api-client-old)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=frontend-api-client-old&metric=bugs&token=73750ac968cd739da2de8b4d7b20df35786395d4)](https://sonarcloud.io/summary/new_code?id=frontend-api-client-old)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=frontend-api-client-old&metric=vulnerabilities&token=73750ac968cd739da2de8b4d7b20df35786395d4)](https://sonarcloud.io/summary/new_code?id=frontend-api-client-old)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=frontend-api-client-old&metric=code_smells&token=73750ac968cd739da2de8b4d7b20df35786395d4)](https://sonarcloud.io/summary/new_code?id=frontend-api-client-old)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=frontend-api-client-old&metric=security_rating&token=73750ac968cd739da2de8b4d7b20df35786395d4)](https://sonarcloud.io/summary/new_code?id=frontend-api-client-old)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=frontend-api-client-old&metric=sqale_rating&token=73750ac968cd739da2de8b4d7b20df35786395d4)](https://sonarcloud.io/summary/new_code?id=frontend-api-client-old)

# BAMBU API Client

This library contains the collection of APIs and API utilities usually required to start a BAMBU project.

## Installation

```
TBD
```

## Usage

### Setting Up Your API Store

```
// main.tsx
import * as ReactDOM from 'react-dom/client';
import { setupApiStore } from '@bambu/lib/frontend-api-client-old';

setupApiStore({ baseURL: 'BASE_API_URL' }).then(() => {
  // start your app
  const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement);

  root.render(<App />);
});
```

By setting up your store this way, any axios instance initialised with `createBambuAxiosInstance` function will automatically use the `baseURL` provided.

### Creating Custom API Instance

```typescript
// api.ts
import { createBambuAxiosInstance } from '@bambu/lib/frontend-api-client-old';

const api = createBambuAxiosInstance();

// this will automatically use the baseURL set in api store
const getCustomers = async () => api.get('/customers');
```

### Using The API

#### API Library API

##### Country Metadata API

Initialising the API instance:

```typescript
import { CountryMetadataApi } from '@bambu/frontend-api-client-old';

const countryApi = new CountryMetadataApi();
```

List of available Country Metadata API methods:

| **API**        | Method | **Description**                                                                                   |
| -------------- | ------ | ------------------------------------------------------------------------------------------------- |
| getCountries() | _/GET_ | To view a list of all the countries available in the platform and the dialing code, currency code |

#### Connect Advisor API

##### Auth API

Initialising the API instance:

```typescript
import { ConnectAdvisorAuthApi } from '@bambu/frontend-api-client-old';

const authApi = new ConnectAdvisorAuthApi();
```

List of available Country Metadata API methods:

| **API** | Method  | **Description**                                                                                                                          |
| ------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| login() | _/POST_ | Logs an advisor in on the Connect platform. It should perform the same action as the core /login endpoint, but with an inferred realmId. |

## Contributing

Please do read [Contributing](./CONTRIBUTING.md) for details.
