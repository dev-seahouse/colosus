export function getDefaultOpsApiHeaders(
  apiVersion: string,
  bearerToken: string,
  idempotencyKey?: string
): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept-Version': apiVersion,
    'Content-Type': 'application/json',
    Authorization: `Bearer ${bearerToken}`,
  };

  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }

  return headers;
}
