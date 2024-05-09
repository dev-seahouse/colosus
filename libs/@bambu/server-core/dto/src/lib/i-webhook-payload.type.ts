export interface IWebhookPayload<
  VALIDATION = unknown,
  BODY = unknown,
  RAW_BODY = Buffer,
  QUERY = Record<string, unknown>,
  HEADERS = Record<string, unknown>
> {
  headers: HEADERS;
  query: QUERY;
  body: BODY;
  rawBody: RAW_BODY;
  path: string | undefined;
  validationResult: VALIDATION;
}
