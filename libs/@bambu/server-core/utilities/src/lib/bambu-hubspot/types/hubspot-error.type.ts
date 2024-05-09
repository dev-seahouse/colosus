export type HubspotError = {
  message: string;
  reason: string;
  responseCode: number;
  isFormatted?: boolean;
};

export function isHubspotError(err: any | HubspotError): err is HubspotError {
  return (err as HubspotError).isFormatted !== undefined;
}
