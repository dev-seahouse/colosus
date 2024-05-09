# Stripe Setup
The purpose of this guide is to show how to set up a hubspot account for Bambu GO.

## Prerequisites
The prerequisites for Hubspot are:

1. You need to have super admin access to the hubspot account.

### Creating the Hubspot private app.

1. From your hubspot account click the settings icon in the top right navbar.
2. Navigate to `Account Setup > Integrations > Private Apps` in the left side nav.
3. Click `Create a private app`.
4. Provide a name and description for the app.
5. Select the `scopes` tab.
7. Add the following scopes:
    - communication_preferences.write
    - crm.objects.contacts.write
    - crm.objects.contacts.read
    - crm.objects.deals.write
    - crm.objects.deals.read
7. Click `Create App` in the top right
8. Copy the generated access token to the .env variables of your deployment.

### Setting environment variables.

Make sure the following environment variables have been set:
- `HUBSPOT_ACCESS_TOKEN` - from the step above.  This is the key that gives the hubspot client access to the hubspot api
- `HUBSPOT_BASE_PATH` - the path to the hubspot api.  This is only required if you are connecting to an alternative environment
- `HUBSPOT_SUBSCRIPTION_ID` - This should be set to match the subscription type from hubspot that the users should be subscribed to if they have chosen to enable marketing.  To find the subscription type id see [Finding Subscription Type](#finding-subscription-type)
- `HUBSPOT_PIPELINE_INITIAL` - This is the name of the pipeline stage that the user should be added to when they register within the product. To find the name of a pipeline stage see [Finding Pipeline Stage](#finding-pipeline-stage)
- `HUBSPOT_PIPELINE_WON` - This is the name of the pipeline stage that the user should be added to when they complete payment for a subscription to the product. To find the name of a pipeline stage see [Finding Pipeline Stage](#finding-pipeline-stage)
- `HUBSPOT_PIPELINE_LOST` - This is the name of the pipeline stage that the user should be added to if they cancel a subscription to the product for any reason. To find the name of a pipeline stage see [Finding Pipeline Stage](#finding-pipeline-stage)
- `HUBSPOT_PIPELINE_ID` - This is the ID of the pipeline to add the deal to.  If not provided deals will be added to the 'default' pipeline.
## Finding Subscription Type

The Subscription type requires api access to find all of the types.  However as we want to keep the permissions for the access key to a minimum, an alternative way to find the id of the Subscription Type is to use the browser developer tools while in the hubspot console.

1. Navigate and log in to hubspot console.
2. Open developer tools in your browser.
3. Navigate to `Marketing > Emails`
4. Click the settings icon in the top right of the page
5. Open the network tab in your developer tools
6. Click the `Subscription Types` tab in the hubspot console
7. Find the response for subscription types in the developer tool network tab.
8. Extract the `id` property of the desired subscription type.

## Finding Pipeline Stage

While the Stages can be retrieved directly through the API, we want to keep the permissions for the access key to a minimum. An  alternative way to find the id of the deal stage is to use the browser developer tools while in the hubspot console.

1. Navigate and log in to hubspot console.
2. Open developer tools in your browser.
3. Navigate to `Sales > Deals`
4. Click the settings icon in the top right of the page
5. Open the network tab in your developer tools
6. Click the `Pipelines` tab in the hubspot console
7. Find the response for pipelines in the developer tool network tab.
8. Extract the `stageId` property of the desired subscription type.