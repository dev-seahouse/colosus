import { decryptContent, encryptContent } from './index';

describe('basic open pgp tests', () => {
  const publicKeyBase64 = `LS0tLS1CRUdJTiBQR1AgUFVCTElDIEtFWSBCTE9DSy0tLS0tCgp4ak1FWlVTUjdCWUpLd1lCQkFIYVJ3OEJBUWRBZU05eTNxT2ZiN0t4RzVJYVl2aytUTVd1WTI0ZEpCSFEKd1cyeGU2QWY4VmpORmtKaGJXSjFJRHhrWlhaQVltRnRZblV1YkdsbVpUN0NqQVFRRmdvQVBnV0NaVVNSCjdBUUxDUWNJQ1pDbk43TnJQZ3RJMVFNVkNBb0VGZ0FDQVFJWkFRS2JBd0llQVJZaEJCUVE2RFF0NTdNVApjeFVMdGFjM3MycytDMGpWQUFEZXhRRC9mSU9xMUhXR1JMKytaaW5rYU9yMmRvTkU2TFNLWnVoTEJIQ3YKZ2ZwM1JmVUJBT0VGZW1nL0hzSkkrR3VnbDBoRDNqRy9VQmZGVHFPSmNxMEpIanFscWpjSXpqZ0VaVVNSCjdCSUtLd1lCQkFHWFZRRUZBUUVIUUVRTzZZWnhZV292QXBYWmlPTDZrUVR4eXhHYm4zY3h1V1IxbVdIawpiL0EvQXdFSUI4SjRCQmdXQ2dBcUJZSmxSSkhzQ1pDbk43TnJQZ3RJMVFLYkRCWWhCQlFRNkRRdDU3TVQKY3hVTHRhYzNzMnMrQzBqVkFBQjM4UUQrUGJFbVJQeHBldzdKWEVKSUEyMjVYa3hra0NTNFY5S2Q3NXN1CngxazkzV3dCQU1BU093aWRUVCt2eUlFMHNhUWYzbGorak9UT1RSVk4zYXZuaitHaUR6RUEKPW4ybysKLS0tLS1FTkQgUEdQIFBVQkxJQyBLRVkgQkxPQ0stLS0tLQo=`;
  const privateKeyBase64 = `LS0tLS1CRUdJTiBQR1AgUFJJVkFURSBLRVkgQkxPQ0stLS0tLQoKeFlZRVpVU1I3QllKS3dZQkJBSGFSdzhCQVFkQWVNOXkzcU9mYjdLeEc1SWFZdmsrVE1XdVkyNGRKQkhRCndXMnhlNkFmOFZqK0NRTUlBTVZhWjhQc3hUcmdpaE1makkveWtpalF5V2xteHBpWlgranJNU3BqMGZPNQpueDlqdkUrMVVSVURpTWtBUnI1Uys4ZjJrOFB6OGhsNmhQcVp0T0tENmxybGoyZ241eEFFVDQ1K21SeS8KbjgwV1FtRnRZblVnUEdSbGRrQmlZVzFpZFM1c2FXWmxQc0tNQkJBV0NnQStCWUpsUkpIc0JBc0pCd2dKCmtLYzNzMnMrQzBqVkF4VUlDZ1FXQUFJQkFoa0JBcHNEQWg0QkZpRUVGQkRvTkMzbnN4TnpGUXUxcHplegphejRMU05VQUFON0ZBUDk4ZzZyVWRZWkV2NzVtS2VSbzZ2WjJnMFRvdElwbTZFc0VjSytCK25kRjlRRUEKNFFWNmFEOGV3a2o0YTZDWFNFUGVNYjlRRjhWT280bHlyUWtlT3FXcU53akhpd1JsUkpIc0Vnb3JCZ0VFCkFaZFZBUVVCQVFkQVJBN3BobkZoYWk4Q2xkbUk0dnFSQlBITEVadWZkekc1WkhXWlllUnY4RDhEQVFnSAovZ2tEQ0U5bXlEUEJ4U2V0NEFhZzdwZWNaYW1FWm1Dc1QvTFptOStURUtFMzdsekkwakZIVzVJTURLY08KU2hla2pFYlBYbjR5K2QvL0JxUHVYWUc0UTlzNGd2VEIvUkFnY2swYUgzd25qZGI1MUpyQ2VBUVlGZ29BCktnV0NaVVNSN0FtUXB6ZXphejRMU05VQ213d1dJUVFVRU9nMExlZXpFM01WQzdXbk43TnJQZ3RJMVFBQQpkL0VBL2oyeEprVDhhWHNPeVZ4Q1NBTnR1VjVNWkpBa3VGZlNuZStiTHNkWlBkMXNBUURBRWpzSW5VMC8KcjhpQk5MR2tIOTVZL296a3prMFZUZDJyNTQvaG9nOHhBQT09Cj1BSWlDCi0tLS0tRU5EIFBHUCBQUklWQVRFIEtFWSBCTE9DSy0tLS0tCg==`;
  const passphrase = `BenK3nnot!`;
  const contentToEncrypt = `{"clientId":"clientId","clientSecret":"clientSecret"}`;

  describe('decryptContent', () => {
    it('should be defined', () => {
      expect(decryptContent).toBeDefined();
    });

    const baselineEncryptedContentBase64 = `LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3VjREMUk4OFpNaldsZ29TQVFkQVZoaHExVGlCUmtFRTdrRGVlcGliYzhsQ0ozcEhmMDExaEJIOEROWm0KWkJzd1RHRWFHenFKbVMvOW9yRWhnOXY5V3I0UlhyMXVaR285S25LTzRJUTBscVNqbCtad1JkM1FFNENsCkhGd3dza09LMHNBc0FYVnFremZoVmYyNDRDWk9kU0tLMzVJR0NQL0xqM1B3b0k5N3B1U0QyRDZZZGxNUwo3SDJSVVhobkZ1dEM4NlJNc2tlc1crck11eHY1aTViWC9NNUxRUjdxVUFiZDgvS1VNK2hqd1M1bk5CdTgKQ0NiRnVrTFJpUUt3aWREZ0tJYkJ3RUVFYU9GemlOK3hJLzlEczZ6ZURDRXBuNHNzUk13SkhoOXpKNTJrCjRrVjJINmRzM2MrUlVSNzQxREFuTndTUUt4dTNRdzNEUHo1QXZoVmdWZkl3V0JmaS9HVmdSTERmcUlHdQozWFNSbWVzc0tHbDUrd09IdjNBanlHTmt3L2NtVm9sdTAzOEg5Z21iSDcwaUQwOVd1UWtVZkI4cWY0RnkKYWJ1SG16a0czTlpvOGdKMER2S2hvMklWN1ZzPQo9NnJlWgotLS0tLUVORCBQR1AgTUVTU0FHRS0tLS0tCg==`;

    it('should return decrypted content', async () => {
      const decryptedContent = await decryptContent({
        encryptedContentBase64: baselineEncryptedContentBase64,
        publicKeyBase64,
        privateKeyBase64,
        passphrase,
      });

      expect(decryptedContent).toBeDefined();
      expect(decryptedContent).toBe(contentToEncrypt);
    });
  });

  describe('encryptContent', () => {
    it('should be defined', () => {
      expect(encryptContent).toBeDefined();
    });

    it('should return encrypted content', async () => {
      const encryptedContent = await encryptContent({
        content: contentToEncrypt,
        publicKeyBase64,
        privateKeyBase64,
        passphrase,
      });

      expect(encryptedContent).toBeDefined();
    });
  });

  describe('encryptContent and decryptContent', () => {
    it('should return decrypted content', async () => {
      const encryptedContent = await encryptContent({
        content: contentToEncrypt,
        publicKeyBase64,
        privateKeyBase64,
        passphrase,
      });

      expect(encryptedContent).toBeDefined();

      const decryptedContent = await decryptContent({
        encryptedContentBase64: encryptedContent.encryptedContentBase64,
        publicKeyBase64,
        privateKeyBase64,
        passphrase,
      });

      expect(decryptedContent).toBeDefined();
      expect(decryptedContent).toBe(contentToEncrypt);
    });
  });
});
