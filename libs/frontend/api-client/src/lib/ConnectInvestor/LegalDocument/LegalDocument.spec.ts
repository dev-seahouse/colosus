// @vitest-environment happy-dom
// use happy-dom because of FormData
import ConnectInvestorLegalDocumentApi from './LegalDocument';

describe('ConnectInvestorLegalDocumentApi', () => {
  const connectInvestorLegalDocumentApi = new ConnectInvestorLegalDocumentApi();

  describe('getLegalDocuments()', () => {
    it('should return a valid response', async () => {
      const res = await connectInvestorLegalDocumentApi.getLegalDocuments();

      expect(res.status).toEqual(200);
      expect(res.data).toEqual({
        privacyPolicyUrl: 'some-pdf.pdf',
        termsAndConditionsUrl: 'some-pdf.pdf',
      });
    });
  });
});
