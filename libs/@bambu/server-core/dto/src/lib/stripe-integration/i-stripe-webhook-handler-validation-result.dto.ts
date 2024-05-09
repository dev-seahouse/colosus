import Stripe from 'stripe';

export interface IStripeWebhookHandlerValidationResultDto {
  isValid: boolean;
  parsedEventPayload: Stripe.Event;
}

export function isStripeWebhookHandlerValidationResultDto(
  input: unknown
): input is IStripeWebhookHandlerValidationResultDto {
  if (!input) {
    return false;
  }

  const coercedInput = input as IStripeWebhookHandlerValidationResultDto;

  const isValidCheck = typeof coercedInput.isValid === 'boolean';

  const eventTypeInPlace =
    coercedInput?.parsedEventPayload?.type !== undefined &&
    coercedInput?.parsedEventPayload?.type !== null;

  return isValidCheck && eventTypeInPlace;
}
