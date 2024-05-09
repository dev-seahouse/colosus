# Stripe Setup
The purpose of this guide is to show how to set up your local development environment for Stripe development/testing.

## Prerequisites
The prerequisites for Stripe development/testing are:

1. You need to have a registered Stripe account.
   - At the time of this writing Haja (haja@bambu.co) is setting up a central Stripe account. Please ask for credentials from him, if it is ready.
   - If the account is not ready, sign up for a new account.
2. You have the mental capacity to know that you need this repository cloned.
3. You have `nvm` in place. Would be funny if you did not.
4. You ran `yarn install` on the repo, if you couldn't muster the intelligence to do it, now is the time to muster it.

### Important Credentials
You will need to get the following credentials.

1. Secret Key

#### Secret Key

![Where to get secret key](https://user-images.githubusercontent.com/4183713/227106833-27c2d35c-be9a-4561-a2a3-648dc6145e1c.png)

Click on the `Reveal` button to get the key. 
This will be used in the interactive `stripe-cli` login and environment variables.

```dotenv
# ...other credentials
STRIPE_SECRET_KEY=<put your secret key here>
```

## Testing The Webhook Locally
To test the Webhooks in your local development environment, you need to set up a `Local Webhook Listener`.
This can be done by going to the `Webhooks` section of the dashboard.

![Adding local lisenter](https://user-images.githubusercontent.com/4183713/227107161-a39c3c5f-bb22-4d88-aad5-e4a0e547a81c.png)

This will being up a screen that will guide you how to set up a local test environment. 
However, to make it work with `Colossus` out of the box, run the following commands.

### Step 1 - Install Stripe-CLI

Follow the guide at https://stripe.com/docs/stripe-cli.

### Step 2 - Authenticate Stripe CLI
Windows (PowerShell)
```powershell
.\stripe.exe login --api-key <put your secret key here>
```
Windows (cmd)
```powershell
stripe login --api-key <put your secret key here>
```
Windows (Git Bash)
```powershell
./stripe.exe login --api-key <put your secret key here>
```
Linux/macOS
```shell
stripe login --api-key <put your secret key here>
```

### Step 3 - Setup Endpoint Forwarding
Windows (PowerShell)
```powershell
.\stripe.exe listen --forward-to localhost:9000/api/webhooks/stripe
```
Windows (cmd)
```shell
stripe listen --forward-to localhost:9000/api/webhooks/stripe
```
Windows (Git Bash)
```shell
./stripe.exe listen --forward-to localhost:9000/api/webhooks/stripe
```
Linux/macOS
```shell
stripe listen --forward-to localhost:9000/api/webhooks/stripe
```

### Step 4 - Start up Colossus

If Colossus is running, you can skip this step. If Colossus is not running, run the following commands.

```shell
docker compose up
```

```shell
yarn start:colossus:api
```

### Step 5 - Trigger Event
Windows (PowerShell)
```powershell
.\stripe.exe trigger payment_intent.succeeded
```
Windows (cmd)
```shell
stripe trigger payment_intent.succeeded
```
Windows (Git Bash)
```shell
./stripe.exe trigger payment_intent.succeeded
```
Linux/macOS
```shell
stripe trigger payment_intent.succeeded
```

### Notes

To test other events, you can see the list of commands by running the following command.

Windows (PowerShell)
```powershell
.\stripe.exe trigger --help
```
Windows (cmd)
```shell
stripe trigger --help
```
Windows (Git Bash)
```shell
./stripe.exe trigger --help
```
Linux/macOS
```shell
stripe trigger --help
```
