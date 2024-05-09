interface IEmailTransportOptions {
  host: string;
  port: number;
}

interface IEmailTransportOptionsUnsecure extends IEmailTransportOptions {
  secure: false;
}

interface IEmailTransportOptionsSecure extends IEmailTransportOptions {
  secure: true;
  auth?: {
    user: string;
    password: string;
  };
}

export function isEmailTransportSecure(
  transport: EmailTransportOptions
): transport is IEmailTransportOptionsSecure {
  return transport && transport.secure;
}

export function isEmailTransportInsecure(
  transport: EmailTransportOptions
): transport is IEmailTransportOptionsUnsecure {
  return transport && !transport.secure;
}

export type EmailTransportOptions =
  | IEmailTransportOptionsSecure
  | IEmailTransportOptionsUnsecure;
