import ConnectAdvisorLegalDocumentApi from './LegalDocument';

describe('ConnectAdvisorLegalDocumentApi', () => {
  const connectAdvisorLegalDocumentApi = new ConnectAdvisorLegalDocumentApi();

  describe('getLegalDocuments()', () => {
    it('should return a valid response', async () => {
      const res = await connectAdvisorLegalDocumentApi.getLegalDocuments();

      expect(res.status).toEqual(200);
      expect(res.data).toEqual({
        privacyPolicyUrl: 'some-pdf.pdf',
        termsAndConditionsUrl: 'some-pdf.pdf',
      });
    });
  });

  describe('uploadDocument()', () => {
    it('should return a valid response', async () => {
      const res = await connectAdvisorLegalDocumentApi.uploadDocument({
        document: new FormData(),
        documentType: 'PRIVACY_POLICY',
      });

      expect(res.status).toEqual(204);
    });
  });
});
