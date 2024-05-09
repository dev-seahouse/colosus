# FE State Management Guidelines

## Introduction

This document describes the guidelines for writing state management code.

Server state is managed using [React Query](https://tanstack.com/query/latest/docs/react/overview).

Client state is managed using [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction).

## What is considered as Server State?

Server state is any state that is retrieved and modified from/through the backend API.

```
✅ when you need to retrieve data from the backend API, the data should be stored in server state
```

## What is considered as Client State?

Client state is any state that is stored temporarily in the browser and can be shared by multiple flows.

```
✅ when a form is broken down into multiple steps, the state of the form should be stored in client state
```

## Combined State

Sometimes both server state and client state can be used simultaneously, e.g:

```
- User wants to update their details (firstname, lastname, etc), pre-populate form with user's current details (retrieved from the backend API)
- The step to update the user's details is broken down into multiple steps, need to hold the state values in the client side.
- After the user has submitted the form, the data should be sent to the backend API to update the user's details and the server state values in the FE should be updated as well.
```
