export abstract class FusionAuthAuthorizationServiceBase {
  abstract Verify(token: string): Promise<boolean>;
}
