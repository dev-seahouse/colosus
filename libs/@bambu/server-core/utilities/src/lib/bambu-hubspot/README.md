# @bambu-hubspot

Simple integration with hubspot to enable subscribing users to hubspot subscription types
when they register with the platform

## Configuration
The following environment variables are used
```bash
HUBSPOT_ACCESS_TOKEN=accesstoken # issued by hubspot REQUIRED
HUBSPOT_BASE_PATH=https://api.hubapi.com # If not provided defaults to https://api.hubapi.com
```


When setting up a hubspot private app. The scopes required are:

- communication_preferences.write
- crm.objects.contacts.write
- crm.objects.contacts.read
- crm.objects.deals.write
- crm.objects.deals.read

# Firing an event to SUBSCRIBE to a subscription type from a service
```typescript
createHubspotSubTest(params: any) {
    return this.eventEmitterService.emitAsync<HubspotSubscribePayload>(
      HUBSPOT_EVENTS.SUBSCRIBE,
      {
        // The email address to subscript
        email: params.email,
        // The ID of the subscription type being subscribed to
        subscriptionID: params.subscriptionID,
        // The legal basis for this subscription (hubspot enum)
        legalBasis: params.legalBasis,
        // The explanation e.g. "user opted-in through registration form"
        legalBasisExplanation: params.legalBasisExplanation,
      },
    );
  }
```

