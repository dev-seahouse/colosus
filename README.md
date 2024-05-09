<br />
<div style="text-align:center;">
  <a href="https://bambu.co" target="blank">
    <img src="./assets/images/feature/colossus-computer.jpg?raw=true" style="width: 50%; height: 50%;" width="640" height="480" alt="Colossus" />
  </a>
  <br />
  <br />
  <img src="./assets/images/logos/bambu-logo.svg" alt="bambu-logo">
  <h3 style="text-align:center;">colossus</h3>

  <p style="text-align:center;">
    <br />
    <a href="https://ref.to.readme.com/when/implemented">Api Docs</a>
    ·
    <a href="https://ref.to.storybook.com/when/deployed">Storybook</a>
    ·
    <a href="https://ref.to.issue.tracker.com/when/setup">Report Bug</a>
    ·
    <a href="https://ref.to.feature.request.com/when/setup">Request Feature</a>
  </p>
</div>

<br />

## Project Overview

### Overall Application Topology / Architecture

![Application Topology](assets/images/diagrams/overall-application-topology-v2.png)

Investor Portal Proxy code is located at https://bitbucket.org/bambudeveloper/colossus-azure-functions/src/master/. 
At the time of this writing, it is an Azure Function (serverless application).

### Apps

| **App Name**                          | **Type**    | Status             | **Description**                                | **Codeowners** |
|---------------------------------------|-------------|--------------------|------------------------------------------------|----------------|
| [@bambu/colossus][bambu/colossus]     | NestJS      | :white_check_mark: | Bambu Robo Advisor API and API Gateway project | @@Backend      |
| [@bambu/go][bambu/go]                 | ReactJS SPA | :white_check_mark: | Bambu GO self serve robo advisor               | @@Frontend     |
| [@bambu/go-advisor][bambu/go-advisor] | ReactJS SPA | :white_check_mark: | React  - Bambu GO advisor interface            | @@Frontend     |


### Libraries

| **Lib Name**                                                                            | **Type** | Status             | **Description**                                                                | **Codeowners**        |
|-----------------------------------------------------------------------------------------|----------|--------------------|--------------------------------------------------------------------------------|-----------------------|
| [@bambu/api-client][bambu/api-client]                                                   | JS       | :white_check_mark: | Bambu Robo Advisor API and API Gateway project                                 | @@Frontend            |
| [@bambu/react-ui][bambu/react-ui]                                                       | ReactJS  | :white_check_mark: | Bambu GO self serve robo advisor                                               | @@Frontend            |
| [@bambu/react-test-utils][bambu/react-test-utils]                                       | ReactJS  | :white_check_mark: | Wrapper for @testing-library/react and @testing-library/user-event             | @@Frontend            |
| [@bambu/storybook-utils][bambu/storybook-utils]                                         | ReactJS  | :white_check_mark: | Storybook utilities, e.g decorators                                            | @@Frontend            |
| [@bambu/go-advisor-core][bambu/go-advisor-core]                                         | ReactJS  | :white_check_mark: | collection of core components shared by multiple features                      | @@Frontend            |
| [@bambu/go-advisor-auth-feature][bambu/go-advisor-auth-feature]                         | ReactJS  | :white_check_mark: | go-advisor auth related components & pages, i.e LoginPage                      | @@Frontend            |
| [@bambu/go-advisor-branding-feature][bambu/go-advisor-branding-feature]                 | ReactJS  | :white_check_mark: | go-advisor branding related components & pages, i.e BrandingPage               | @@Frontend            |
| [@bambu/go-advisor-profile-creation-feature][bambu/go-advisor-profile-creation-feature] | ReactJS  | :white_check_mark: | go-advisor profile creation related components & pages, i.e AdvisorDetailsPage | @@Frontend            |
| [@bambu/server-core/common-errors][bambu/server-core/common-errors]                     | NestJS   | :white_check_mark: | TBD                                                                            | @@Backend             |
| [@bambu/server-core/common-guards][bambu/server-core/common-guards]                     | NestJS   | :white_check_mark: | NestJS guards                                                                  | @@Backend             |
| [@bambu/server-core/common-rest-endpoints][bambu/server-core/common-rest-endpoints]     | NestJS   | :white_check_mark: | TBD                                                                            | @@Backend             |
| [@bambu/server-core/configuration][bambu/server-core/configuration]                     | NestJS   | :white_check_mark: | TBD                                                                            | @@Backend             |
| [@bambu/server-core/db][bambu/server-core/db]                                           | NestJS   | :white_check_mark: | TBD                                                                            | @@Backend             |
| [@bambu/server-core/domains][bambu/server-core/domains]                                 | NestJS   | :white_check_mark: | Library representing domains common to most products                           | @@Backend             |
| [@bambu/server-core/repositories][bambu/server-core/repositories]                       | NestJS   | :white_check_mark: | TBD                                                                            | @@Backend             |
| [@bambu/server-core/utilities][bambu/server-core/utilities]                             | NestJS   | :white_check_mark: | TBD                                                                            | @@Backend             |
| [@bambu/server-connect/domains][bambu/server-connect/domains]                           | NestJS   | :white_check_mark: | Library representing domains specific to Connect                               | @@Backend             |
| [@bambu/shared][bambu/shared]                                                           | JS       | :white_check_mark: | Shared types used across BE and FE                                             | @@Backend, @@Frontend |



[bambu/go]: ./apps/go/README.md 'Bambu GO Interface'
[bambu/go-advisor]: ./apps/go-advisor/README.md 'Bambu GO Advisor Interface'
[bambu/shared]: ./libs/shared/README.md 'Shared JS library'
[bambu/colossus]: ./apps/colossus/README.md 'Bambu API'
[bambu/api-client]: ./libs/frontend/api-client/README.md 'Bambu API Client'
[bambu/react-ui]: ./libs/frontend/react-ui/README.md 'Bambu React UI'
[bambu/storybook-utils]: ./libs/frontend/storybook-utils/README.md 'Bambu Storybook Utils'
[bambu/server-core/common-errors]: ./libs/@bambu/server-core/common-errors/README.md 'Bambu Server Core Common Errors'
[bambu/server-core/common-guards]: ./libs/@bambu/server-core/common-guards/README.md 'Bambu Server Core Common Guards'
[bambu/server-core/common-rest-endpoints]: ./libs/@bambu/server-core/common-rest-endpoints/README.md 'Bambu Server Core Common Rest Endpoints'
[bambu/server-core/configuration]: ./libs/@bambu/server-core/configuration/README.md 'Bambu Server Core Configuration'
[bambu/server-core/db]: ./libs/@bambu/server-core/db/README.md 'Bambu Server Core DB'
[bambu/server-core/domains]: ./libs/@bambu/server-core/domains/README.md 'Bambu Server Core Domains'
[bambu/server-core/repositories]: ./libs/@bambu/server-core/repositories/README.md 'Bambu Server Core Repositories'
[bambu/server-core/utilities]: ./libs/@bambu/server-core/utilities/README.md 'Bambu Server Core Utilities'
[bambu/server-connect/domains]: ./libs/@bambu/server-connect/domains/README.md 'Bambu Connect Server Domains'
[bambu/go-advisor-core]: ./libs/frontend/go-advisor/core/README.md 'Bambu GO Advisor Core'
[bambu/go-advisor-auth-feature]: ./libs/frontend/go-advisor/auth-feature/README.md 'Bambu GO Advisor Auth Feature'
[bambu/go-advisor-branding-feature]: ./libs/frontend/go-advisor/branding-feature/README.md 'Bambu GO Advisor Branding Feature'
[bambu/go-advisor-profile-creation-feature]: ./libs/frontend/go-advisor/profile-creation-feature/README.md 'Bambu GO Advisor Profile Creation Feature'
[bambu/react-test-utils]: ./libs/frontend/react-test-utils/README.md 'Bambu React test utils'

## Pre-requisites :warning:

To ensure that you can run the applications smoothly, please make sure the following requirements are met:

- [NVM (Node Version Manager)](#setting-up-node)
- Yarn 1.x
- [Docker](https://www.docker.com/)
- [NX Console](https://nx.dev/core-features/integrate-with-editors) - VSCode/Webstorm NX extension
- [Setting up environment variables](#setting-up-your-environment-variables)


### Setting up Node

After installing NVM, run the following command to install the correct version of Node:

```bash
# MacOS/*nix
# Selects proper Node version.
# If it says you don't have the proper version,
# run NVM install on the specified version.
$ > nvm use

# Windows
PS > .\_nvmrc-windows.ps1
```

### Setting up Your Environment Variables

Ensure your `.env` file has the items shown in the previous snippet and place it in the `root` directory of the project.

The minimal `.env` file can se seen in the following snippet.

```dotenv
# COLOSSUS

# Set to development for environment
NODE_ENV=development

# Docker Compose Environment Setup - Start
POSTGRES_USER=dbadmin
POSTGRES_PASSWORD=THfk2N9AnE
ES_JAVA_OPTS="-Xms512m -Xmx512m"
DATABASE_USERNAME=fusionauth
DATABASE_PASSWORD=hkaLBM3RVnyYeYeqE3WI1w2e4Avpy0Wd5O3s3
FUSIONAUTH_APP_MEMORY=512M
# Docker Compose Environment Setup - End

# DB connection string to main DB
CENTRAL_DB_URL=postgres://dbadmin:THfk2N9AnE@localhost:5432/colossus_dev
# DB connection string to shadow DB
SHADOW_CENTRAL_DB_URL=postgres://dbadmin:THfk2N9AnE@localhost:5432/colossus_dev_shadow
# Defines Colossus Log Level, this shows everything.
LOG_LEVEL=log,error,warn,debug,verbose
# connection string to IAM solution
KEYCLOAK_BASE_URL=http://localhost:8080
# allowed CORS ORIGIN
CORS_ORIGIN=http://127.0.0.1:4200,http://127.0.0.1:4300
# set to base url of Connect Advisor (for use by Colossus BE)
CONNECT_ADVISOR_BASE_URL=http://127.0.0.1:4200

# Email Setup - Start
# Now emails can be viewed locally without using SMTP @ http://localhost:1080
MAIL_TRANSPORT_HOST=localhost
MAIL_TRANSPORT_PORT=1025
MAIL_TRANSPORT_SECURE=0
MAIL_TRANSPORT_USERNAME=" "
MAIL_TRANSPORT_PASSWORD=" "
# Email Setup - End

# GO Advisor (Connect) - Start
VITE_CONNECT_ADVISOR_API_BASE_URL=http://localhost:9000
# set to true to use mock server
VITE_CONNECT_ADVISOR_USE_MOCK=false
# GO Advisor (Connect) - End

# GO Investor (Connect) - Start
VITE_CONNECT_INVESTOR_API_BASE_URL=http://localhost:9000
# set to true to use mock server
VITE_CONNECT_INVESTOR_USE_MOCK=false
# origin override for local development
VITE_CONNECT_INVESTOR_ORIGIN_OVERRIDE=<YOUR TENANT URL HERE e.g fe.localhost:4200>
# GO Investor (Connect) - End

# GO FE - Start
VITE_API_BASE_URL=http://localhost:9000
VITE_GO_FE_FEATURE_FLAG_API_KEY=25d223d5-3cb8-42e1-9af1-d0488cdb5f15
# GO FE - End

# Stripe Server Config - Start
STRIPE_API_VERSION=2022-11-15
STRIPE_SECRET_KEY=<Stripe secret key>
STRIPE_WEBHOOK_ENDPOINT_SECRET=<stripe webhook endpoint secret>
# Stripe Server Config - End

# Hubspot Client Config - Start
HUBSPOT_ACCESS_TOKEN=pat-na1-470f62eb-306a-470e-8518-9958ec9d7f50
HUBSPOT_BASE_PATH=https://api.hubapi.com
HUBSPOT_SUBSCRIPTION_ID=8766587
HUBSPOT_PIPELINE_INITIAL=presentationscheduled
HUBSPOT_PIPELINE_WON=closedwon
HUBSPOT_PIPELINE_LOST=closedlost
HUBSPOT_PIPELINE_ID=3770112
# Hubspot Client Config - End

# File Upload Config - Start
TEMPORARY_FILE_DIRECTORY=/tmp
# File Upload Config - End

# Azure Storage Config - Start
AZURE_STORAGE_CONNECTION_STRING=<connection string issued>
AZURE_STORAGE_COLOSSUS_CONTAINER_NAME=$web
AZURE_STORAGE_PUBLIC_SYSTEM_ASSETS_PUBLIC_BASE_URL=<CDN URL for system assets>
AZURE_STORAGE_ADVISOR_PUBLIC_ASSETS_PUBLIC_BASE_URL=<CDN URL for tenant public assets>
# Azure Storage Config - End

# Keycloak FusionAuth Switchover Config - Start
# note that the following is committed by default, since it is a
# variable that us significant for a few versions while we are
# switching to FusionAuth. It takes values in strings 0 (use FusionAuth for tenant creation) or 1 (use KeyCloak for tenant creation)
# USE_LEGACY_KEYCLOAK_FOR_TENANT_CREATION=0

# FusionAuth Config - Start
FUSION_AUTH_BASE_URL=http://localhost:9011
FUSION_AUTH_ADMIN_API_KEY=<self_service>
# FusionAuth Config - End

# Wealth Kernel Config - Start
WEALTH_KERNEL_AUTH_API_BASE_URL=https://auth.sandbox.wealthkernel.io
WEALTH_KERNEL_OPS_API_BASE_URL=https://api.sandbox.wealthkernel.io
STUB_WEALTH_KERNEL_CLIENT_ID=<ask somebody>
STUB_WEALTH_KERNEL_CLIENT_SECRET=<ask somebody>
# Wealth Kernel Config - End

# Enable New Tract Config - Start
USE_LEGACY_TRANSACT_FOR_INVESTOR_CREATION=0
# Enable New Tract Config - End

# Wealth Kernel Connector Config - Start
# For local API development, use host.docker.internal or get your Docker host machine's IP address
# WEALTH_KERNEL_CONNECTOR_HOST_DOCKER=http://host.docker.internal
# For FE development use this
WEALTH_KERNEL_CONNECTOR_HOST_DOCKER=http://wealth-kernel-connector
# Wealth Kernel Connector Config - End

# OPEN PGP - Start
PGP_PASSPHRASE=BenK3nnot!
PGP_PRIVATE_KEY_BASE64=LS0tLS1CRUdJTiBQR1AgUFJJVkFURSBLRVkgQkxPQ0stLS0tLQoKeFlZRVpVU1I3QllKS3dZQkJBSGFSdzhCQVFkQWVNOXkzcU9mYjdLeEc1SWFZdmsrVE1XdVkyNGRKQkhRCndXMnhlNkFmOFZqK0NRTUlBTVZhWjhQc3hUcmdpaE1makkveWtpalF5V2xteHBpWlgranJNU3BqMGZPNQpueDlqdkUrMVVSVURpTWtBUnI1Uys4ZjJrOFB6OGhsNmhQcVp0T0tENmxybGoyZ241eEFFVDQ1K21SeS8KbjgwV1FtRnRZblVnUEdSbGRrQmlZVzFpZFM1c2FXWmxQc0tNQkJBV0NnQStCWUpsUkpIc0JBc0pCd2dKCmtLYzNzMnMrQzBqVkF4VUlDZ1FXQUFJQkFoa0JBcHNEQWg0QkZpRUVGQkRvTkMzbnN4TnpGUXUxcHplegphejRMU05VQUFON0ZBUDk4ZzZyVWRZWkV2NzVtS2VSbzZ2WjJnMFRvdElwbTZFc0VjSytCK25kRjlRRUEKNFFWNmFEOGV3a2o0YTZDWFNFUGVNYjlRRjhWT280bHlyUWtlT3FXcU53akhpd1JsUkpIc0Vnb3JCZ0VFCkFaZFZBUVVCQVFkQVJBN3BobkZoYWk4Q2xkbUk0dnFSQlBITEVadWZkekc1WkhXWlllUnY4RDhEQVFnSAovZ2tEQ0U5bXlEUEJ4U2V0NEFhZzdwZWNaYW1FWm1Dc1QvTFptOStURUtFMzdsekkwakZIVzVJTURLY08KU2hla2pFYlBYbjR5K2QvL0JxUHVYWUc0UTlzNGd2VEIvUkFnY2swYUgzd25qZGI1MUpyQ2VBUVlGZ29BCktnV0NaVVNSN0FtUXB6ZXphejRMU05VQ213d1dJUVFVRU9nMExlZXpFM01WQzdXbk43TnJQZ3RJMVFBQQpkL0VBL2oyeEprVDhhWHNPeVZ4Q1NBTnR1VjVNWkpBa3VGZlNuZStiTHNkWlBkMXNBUURBRWpzSW5VMC8KcjhpQk5MR2tIOTVZL296a3prMFZUZDJyNTQvaG9nOHhBQT09Cj1BSWlDCi0tLS0tRU5EIFBHUCBQUklWQVRFIEtFWSBCTE9DSy0tLS0tCg==
PGP_PUBLIC_KEY_BASE64=LS0tLS1CRUdJTiBQR1AgUFVCTElDIEtFWSBCTE9DSy0tLS0tCgp4ak1FWlVTUjdCWUpLd1lCQkFIYVJ3OEJBUWRBZU05eTNxT2ZiN0t4RzVJYVl2aytUTVd1WTI0ZEpCSFEKd1cyeGU2QWY4VmpORmtKaGJXSjFJRHhrWlhaQVltRnRZblV1YkdsbVpUN0NqQVFRRmdvQVBnV0NaVVNSCjdBUUxDUWNJQ1pDbk43TnJQZ3RJMVFNVkNBb0VGZ0FDQVFJWkFRS2JBd0llQVJZaEJCUVE2RFF0NTdNVApjeFVMdGFjM3MycytDMGpWQUFEZXhRRC9mSU9xMUhXR1JMKytaaW5rYU9yMmRvTkU2TFNLWnVoTEJIQ3YKZ2ZwM1JmVUJBT0VGZW1nL0hzSkkrR3VnbDBoRDNqRy9VQmZGVHFPSmNxMEpIanFscWpjSXpqZ0VaVVNSCjdCSUtLd1lCQkFHWFZRRUZBUUVIUUVRTzZZWnhZV292QXBYWmlPTDZrUVR4eXhHYm4zY3h1V1IxbVdIawpiL0EvQXdFSUI4SjRCQmdXQ2dBcUJZSmxSSkhzQ1pDbk43TnJQZ3RJMVFLYkRCWWhCQlFRNkRRdDU3TVQKY3hVTHRhYzNzMnMrQzBqVkFBQjM4UUQrUGJFbVJQeHBldzdKWEVKSUEyMjVYa3hra0NTNFY5S2Q3NXN1CngxazkzV3dCQU1BU093aWRUVCt2eUlFMHNhUWYzbGorak9UT1RSVk4zYXZuaitHaUR6RUEKPW4ybysKLS0tLS1FTkQgUEdQIFBVQkxJQyBLRVkgQkxPQ0stLS0tLQo=
PGP_REVOCATION_CERTIFICATE_BASE64=LS0tLS1CRUdJTiBQR1AgUFVCTElDIEtFWSBCTE9DSy0tLS0tCkNvbW1lbnQ6IFRoaXMgaXMgYSByZXZvY2F0aW9uIGNlcnRpZmljYXRlCgp3bmdFSUJZS0FDb0ZnbVZFa2V3SmtLYzNzMnMrQzBqVkFwMEFGaUVFRkJEb05DM25zeE56RlF1MXB6ZXoKYXo0TFNOVUFBQlB3QVFEUUYyUkhpcEUvalQraENEL1ZSQW1BU2pHWVhpTzRtZERrcTBqa21hVHdDUUQ3CkI2ak4rd2tHSWpwZ1dMK1FKcFp1enQvTnl4RHg1TXNxZmo2VC94YVRJd3M9Cj1YeWNoCi0tLS0tRU5EIFBHUCBQVUJMSUMgS0VZIEJMT0NLLS0tLS0K
# OPEN PGP - End
```

### Fusion Auth Setup

To set up `FusionAuth` read [FUSIONAUTH-SETUP.md](docs/setup/FUSIONAUTH-SETUP.md).

### Azure CDN SETUP

This section will show the Azure CDN environment variables for specific environments.

#### DEV
```dotenv
AZURE_STORAGE_PUBLIC_SYSTEM_ASSETS_PUBLIC_BASE_URL=https://cdn.dev.go-bambu.co
AZURE_STORAGE_ADVISOR_PUBLIC_ASSETS_PUBLIC_BASE_URL=https://tenant-assets.dev.go-bambu.co
```

### Stripe Setup

To set up `Stripe` read [STRIPE-SETUP.md](docs/setup/STRIPE-SETUP.md).

### HubSpot Setup

To set up `Hubspot` read [HUBSPOT-SETUP.md](docs/setup/HUBSPOT-SETUP.md).

## The Philosophy

> Focus and speed

When developing it is much more productive to focus on smaller features and reduce the context that a developer must keep in their heads while developing. The tooling should not get in the way of the developer rather should enhance the developer experience to allow the developer to easily enter the state of flow.

Context shifting takes time, both moving into and out of a context prior to development. The choices made in this repository are intended to reduce the amount of context shifting a developer is required to make as they are working through each task.

Coordination across teams of developers can at times become difficult particularly in a distributed environment where responsibilities cross multiple tiers of the development stack. It is more productive when a developer immediately knows the impact of their own changes across the stack.

Smaller is better. Small changes faster allows for a CD process with extremely fast feedback cycles allowing developers and product owners to assess features based on user need. This allows for feature emergence where a features is started but can change to better fit the user need. In addition the act of releasing many times a day produces much lower risk releases and a much smaller rollback cycle.

# Developers

## Continuous delivery

> Continuous delivery is the ability to get changes of all types - including new features, configuration changes, bug fixes, and experiments - into production, or into the hands of users, safely and quickly, in a sustainable way.
>
> -- <cite>Jez Humble</cite>

Continuous delivery (CD) has been proven to create more stable software that is more aligned to the user needs.
Evidenced [here](https://continuousdelivery.com/evidence-case-studies/).

CD makes use of 3 phases in an automated pipeline.

**Continuous Integration**
: Ensures that code written by different developers and teams is integrated. During this step code is compiled, unit tests are executed, and code quality is verified. It is imperitive that this phase is extremely fast ensuring fast feedback for the developers as they commit code.

**Automated acceptance testing**
: Ensures that the users requirements have been met. This stage ensures that developers take responsiblity for the testing instead of passing the code over to a QA team which increases the time to release and introduces the complexity of locking releases for testing. Acceptance tests are usually in the form of end to end tests that replicate the user and business requirements.

**Configuration Management**
: Configures the environments and deploys the software. The configuration management phase takes care of installing the appropriate tools on deployment targets and deploying the infrastructure, services, and applications as required.

## Tooling choices

The tooling choices have been made to fit the philosophy and to provide a developer with a clean, easy, and fast developer experience. The intent of the choices are to allow a developer to focus on what they need to, not on what they have to. The choices are all intended to allow developers to develop and not worry so much about the wiring.

### Monorepo

> Work together, play together

The choice of a monorepo fits enables a developer to see the impact across all aspects of a system when they make changes. It also allows developers to explore areas of the system that they may not usually get involved in. [NX](https://nx.dev/) is particularly good at providing a clean and fast developer experience while dealing with the internals of linking libraries to applications.

### Node Version

The repository is intended to work on node 16. Node 16 in particular as Node 17 introduced a number of issues and has been skipped over by the industry. Node 18 is not yet supported out of the box by all cloud provides and with the philosophy of not worrying about the wiring, Node 16 makes the most sense for the time being. This will change as more cloud providers start to support Node 18.

#### Getting the Correct Node.js Version

NVM is utilized to simplify Node.js version changes and maintain consistency.

Please install NVM on your machine before proceeding.

##### MacOS/*NIX

If you are using a *NIX based bash interface, setting the correct Node.js version via NVM can be done by running the command below:

```shell
$ > nvm use
```

This command attempts to set the current Node.js version as configured in `./.nvmrc`. If not installed, the terminal will prompt you to install the specified version in the file.

##### Windows 10/11

If you are using a Windows machine, run the following command in PowerShell (you may need elevated permissions):

```powershell
PS > .\nvmrc-windows.ps1
```

What the script does is as follows:

1. Ensure that you have the desired version of Node.js in place in your NVM installation.
1. Selects the desired version for you.
1. Runs `corepack enable` to enable the bundled `Yarn` package manager.

### Package Manager

We have chosen [yarn](https://yarnpkg.com/) for dependency management for the following reasons:

- **Speed** - NPM installs dependency packages sequentially, Yarn installs in-parallel. Because of this, Yarn performs faster than NPM when installing larger files.
- **Security** - Yarn performs a security check as a background process while downloading packages. It uses the package license information to ensure it doesn't download any malicious scripts or cause any dependency conflicts.

### Compilers

Where possible javascript/typescript is compiled with [swc](https://swc.rs/) as it is much faster than babel. This directly aligns with the philosopy of a faster developer experience.

### Bundlers

As a monorepo contains multiple code bases, we have chosen bundlers based on the intent of the module in the repo.

#### API

#### JS Libraries

We use [Rollup](https://rollupjs.org/). This allows us to take advantage of the ES6
modular approach to development while commpiling back to formats that are backwards compatible.

#### UI Libraries

[React UI Library](./libs/react-ui-components/README.md)

#### API Framework

For APIs **nestjs**(https://nestjs.com/) is used for its modular focus. This fits in well with the philosopy of the repository around context and focusing on smaller pieces. Additionaly nestjs is consistent with the philosopy of coordination in that the DTOs used by nestjs can also be used in a frontend project such as React allowing for tighter collaboration between front and backend teams.

For the ORM [prisma](https://www.prisma.io/) is used primarily for its ability to generate code that can be shared across FE/BE projects, in addition its support for nestjs allows for auto generation of swagger documentation which can in turn be used to generate postman collections allowing for easy communication of the apis

Caching is implemented through [redis](https://redis.com/) the speed and ubiquity of redis make it an obvious choice for caching. Redis also includes some great pub/sub support which allows for transient realtime features to be developed without much effort.

Do more with less effort. In life in general if you can achive multiple goals while executing a single task you are using your time exponentially rather than linearly. A focus on abstraction, componentisation, and modularisation allows for developers to apply their time in one area and benefit many. Abstraction allows developers to assess and apply solutions across domains rather than getting stuck in the details of a problem. This allows for a more developer driven approach to systems. More creativity and emergence of ideas applied across systems and platform.

### Testing

#### Unit Tests

Frontend unit tests are executed using [Vitest](https://vitest.dev/). Please refer to the [FE unit test documentation](./docs/frontend/guidelines/fe-unit-test-guidelines.md) for more information about testing frontend apps & libs.

Backend unit tests are executed using [Jest](https://jestjs.io/).

#### E2E Tests

Please refer to the [FE e2e test documentation](./docs/frontend/guidelines/fe-e2e-test-guidelines.md) for more information.

## IMPORTANT! :warning: Contributing

Before contributing to this repository, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

## Running Colossus

This section will show how to run colossus platform.

## Running Colossus API Server

Before running the colossus server, please ensure you have the following prerequisites.

1. Docker installed.
2. `.env` file defined.

Please follow the instructions to set up your environment variables [here](#setting-up-your-environment-variables).

With that out of the way, in order to start colossus, you will need to perform the following steps.

### Step 1 - Ensure backup script can be executed (Linux Only)

Run the following command to ensure that the shell scripts can be executed.

```shell
yarn prepare:nix:shell-scripts
```

### Step 2 - Run Command

You can run the following command to startup the backend.

**Windows**
```powershell
PS > .\_startup-backend.ps1
```

__*nix__
```shell
$ > ./_startup-backend.sh
```

## Deployment

Please refer to [DEPLOYMENT.md](./DEPLOYMENT.md) file for more information.

## Documentation

- [Frontend Docs](docs/frontend/frontend-docs.md)
- [Continuous Integration (CI) Setup](docs/general/continuous-integration.md)
