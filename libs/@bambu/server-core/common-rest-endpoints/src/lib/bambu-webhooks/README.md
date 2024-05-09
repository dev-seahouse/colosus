# @bambu-webhooks

Enables dynamic webhook registration and handling though the Event Emitter

## Register a webhook

```typescript

type ValidationResponseType = {
  prop1: string;
  prop2: string;
  prop3: string;
};
class TestWebhookHandler extends BambuWebhookHandler<ValidationResponseType> {
  constructor(
    private readonly webhooksService: BambuWebhooksService
  ) {
    super();
    // Register this webhook so that it will be handled
    this.webhooksService.register('MyArbitraryWebhookNameSoICanUnregisterIfNeeded', this);
  }

  canHandle(
    headers: Record<string, unknown>,
    body: unknown,
    query: Record<string, unknown>,
    path: string
  ) {
    // Determine if this class should be handling the data
    // In this case we are specifically looking for the provider to be stripe.
    return body?.payload?.provider === 'stripe';
  }

  validate(
    headers: Record<string, unknown>,
    body: unknown,
    query: Record<string, unknown>,
    path: string
  ): Observable<ValidationResponseType> {
    // Validate that the payload has come from where it was supposed to
    const checksum = calculateChecksumFromBodyandHeaders(body, headers);
    return fetch(`stripeurl/validation?checksum=${checksum}`).pipe(
      map((res)=>{
        if (res !== 'OK') {
          throw new BadRequestError('Not signed by stripe');
        }
        return res;
      });
    );
  }

  getEventName(
    headers: Record<string, unknown>,
    body: unknown,
    query: Record<string, unknown>,
    path: string,
    validation: unknown
  ): string {
    // The validation has executed by this point so we can treat the content as legit
    if (body.payload.event === 'subscription.cancelled') {
      return 'bambu.subscription.cancel';
    } else if (body.payload.event === 'card.expired') { {
      return 'bambu.credit_card.expired';
    } else {
      return 'bambu.stripe.generic';
    }
  }

  // Note the name of the fired events is generated using `webhook.${getEventName(...)}`

  @OnEvent('webhook.bambu.subscription.cancel')
  handleSubscriptionCancelled(payload: IWebhookPayload) {
    // Cancel the sub
  }

  @OnEvent('webhook.bambu.credit_card.expired')
  handleSubscriptionCancelled(payload: IWebhookPayload) {
    // Notify the user their account is being deleted
  }

  @OnEvent('webhook.bambu.stripe.generic')
  handleGenericStripe(payload: IWebhookPayload) {
    // Handle the generic stripe event
  }
}
```
