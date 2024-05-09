export type EmailResponseInfo = {
  accepted: string[];
  rejected: string[];
  ehlo: string[];
  envelopeType: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: {
    from: string;
    to: string[];
  };
  messageID: string;
};
