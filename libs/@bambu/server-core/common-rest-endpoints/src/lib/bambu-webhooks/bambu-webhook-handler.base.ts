import { Observable } from 'rxjs';

export abstract class BambuWebhookHandler<V = unknown> {
  abstract canHandle(
    headers: Record<string, unknown>,
    body: unknown,
    rawBody: Buffer,
    query: Record<string, unknown>,
    path?: string
  ): boolean;

  abstract validate(
    headers: Record<string, unknown>,
    body: unknown,
    rawBody: Buffer,
    query: Record<string, unknown>,
    path?: string
  ): Observable<V>;

  abstract getEventName(
    headers: Record<string, unknown>,
    body: unknown,
    rawBody: Buffer,
    query: Record<string, unknown>,
    path: string | undefined,
    validation: V
  ): string;
}
