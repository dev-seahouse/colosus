# FusionAuth Setup

The purpose of this guide is to show how to set up a fusion auth account for Bambu GO.

## Prerequisites

The prerequisites for FusionAuth are:

1. Your `docker-compose.yaml was set up to use the correct envvars. (refer to README.md/Setting up Your Environment Variables)
2. Ensure that docker compose is up with the envvars set from the file (see. `-f <insert-path-here>).


### Creating an API key.

1. Navigate to http://localhost:9011
2. Fill in the fields to create an admin user, and login into the management console
3. The dashboard should alert you with `Missing API Key`. Navigate to `Add API Key`: `Home > Settings > API Keys > Add`.
4. The default settings create a `super user key`. Optionally specify a description, then click the `Save` icon at the top right.
5. Navigate to your local `.env` file and supply `FUSION_AUTH_ADMIN_API_KEY` to the listed key value in the interface.
6. Start colossus continuing the rest of the setup.
