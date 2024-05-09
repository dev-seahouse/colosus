# Basic Authentication Requirements

This document aims to provide a functional specification without tying the language to any specific standards, such as OAuth or LDAP, to enhance implementation flexibility for the developer.

## Authentication Scopes

There will be 5 access types/tokens. The following sub sections will define them.

### 1. Public
This feature is intended for potential investors of a given advisor (tenant) who are not yet registered with the advisor but wish to open an account. It grants users the following access:

1. Access publically available onboarding screens. These include the following API groups.
    1. Bambu API Library Goal Helpers.
    1. Lead API.
    1. User API.
        1. Create new account.
        1. Check username available.
        1. Login.
        1. Reset password.

The items mentioned are by no means an exhaustive list and items can be added along the way.

Binding public requests to an advisor (tenant) is necessary to prevent unauthorized operations on public-facing APIs, as using URLs can be easily manipulated. Thus, we must implement this measure.

How this works will be the front-end will query for a public access token before accessing any APIs and renew the token at a later agreed upon interval.

### 2. Investor
This is for investors who are logged into the system to manage their goals, move money, KYC, etc.

Please take note that Bambu API Library functionality, including goal helpers should be accessible in this access scope as well.

### 3. Bambu
This is for Bambu personnel to perform platform wide operations. Exact functionality is still being mapped out.

## Additional Notes
1. Use the `central-db` for now. At this stage we will be using 1 DB to expedite development. We will explore different DB schemas namespaces, sharing and multiple DB architecture later.
1. Please add `iam` service integrations as a repository in `libs/@bambu/server-core/repositories`.