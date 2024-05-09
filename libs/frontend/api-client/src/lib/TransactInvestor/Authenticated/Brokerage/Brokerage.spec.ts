import { TransactInvestorAuthenticatedBrokerageApi } from './Brokerage';
import { submitKycToBrokerageMockRequest } from './mocks/submitKycToBrokerageMockRequest';
import { createDirectDebitMandateMockReq } from './mocks/createDirectDebitMandateMockReq';
import { createBankAccMockReq } from './mocks/createBankAccMockReq';
import createDirectDebitPaymentMockReq from './mocks/createDirectDebitPaymentMockReq';
import { InvestorBrokerageUkDirectDebitSubscriptionIntervalEnum } from './Brokerage.types';
import { createWithdrawalMockReq } from './mocks/createWithdrawalMockReq';

describe('TransactAuthenticatedBrokerageApi', () => {
  const brokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
  test('submitKycToBrokerage', () => {
    it('should return a valid response', async () => {
      const res = await brokerageApi.submitKycToBrokerage(
        submitKycToBrokerageMockRequest
      );
      expect(res.data).toBeDefined();
    });
  });

  test('getBrokerageProfileForInvestor', () => {
    const brokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
    it('should return a valid response', async () => {
      const res = await brokerageApi.getBrokerageProfileForInvestor();
      expect(res.data).toBeDefined();
    });
  });

  test('createBankAccountForParty', () => {
    const brokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
    it('should return a valid response', async () => {
      const res = await brokerageApi.createBankAccountForParty(
        createBankAccMockReq
      );
      expect(res.data).toBeDefined();
    });
  });

  test('getBankAccounts', () => {
    const brokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
    it('should return a valid response', async () => {
      const res = await brokerageApi.getBankAccounts();
      expect(res.data).toBeDefined();
    });
  });

  test('getBankAccountById', () => {
    const brokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
    it('should return a valid response', async () => {
      const res = await brokerageApi.getBankAccountById({
        bankAccountId: '34343',
      });
      expect(res.data).toBeDefined();
    });
  });

  test('createDirectDebitMandateForParty', () => {
    const brokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
    it('should return a valid response', async () => {
      const res = await brokerageApi.createDirectDebitMandateForParty(
        createDirectDebitMandateMockReq
      );
      expect(res.data).toBeDefined();
    });
  });

  test('getDirectDebitMandatesByParty', () => {
    const brokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
    it('should return a valid response', async () => {
      const res = await brokerageApi.getDirectDebitMandatesByParty();
      expect(res.data).toBeDefined();
    });
  });

  test('cancelDirectDebitMandate', () => {
    const brokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
    it('should return a valid response', async () => {
      const res = await brokerageApi.cancelDirectDebitMandate({
        mandateId: '34343',
      });
      expect(res.data).toBeDefined();
    });
  });

  test('getDirectDebitMandatePdf', () => {
    const brokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
    it('should return a valid response', async () => {
      const res = await brokerageApi.getDirectDebitMandatePdf({
        mandateId: '34343',
      });
      expect(res.data).toBeDefined();
    });
  });

  test('getDirectDebitMandatePdfPreview', () => {
    const brokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
    it('should return a valid response', async () => {
      const res = await brokerageApi.getDirectDebitMandatePdfPreview({
        bankAccountId: '34343',
      });
      expect(res.data).toBeDefined();
    });
  });

  test('getNextPossiblePaymentDate', () => {
    const brokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
    it('should return a valid response', async () => {
      const res = await brokerageApi.getNextPossiblePaymentDate({
        mandateId: '2222',
      });
      expect(res.data).toBeDefined();
    });
  });

  test('getDirectDebitPayments', () => {
    const brokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
    it('should return a valid response', async () => {
      const res = await brokerageApi.getDirectDebitPayments();
      expect(res.data).toBeDefined();
    });
  });

  test('createDirectDebitPayments', () => {
    const brokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
    it('should return a valid response', async () => {
      const res = await brokerageApi.createDirectDebitPayment(
        createDirectDebitPaymentMockReq
      );
      expect(res.data).toBeDefined();
    });
  });

  test('createDirectDebitSubscriptions', () => {
    const api = new TransactInvestorAuthenticatedBrokerageApi();
    it('should return a valid response', async () => {
      const res = await api.createDirectDebitSubscription({
        mandateId: '34343',
        goalId: '34343',
        amount: {
          currency: 'GBP',
          amount: 100,
        },
        interval:
          InvestorBrokerageUkDirectDebitSubscriptionIntervalEnum.MONTHYL,
        dayOfMonth: 1,
        month: 'JANUARY',
        startDate: '2021-01-01',
      });
      expect(res.data).toBeDefined();
    });
  });

  test('createWithdrawalRequest', async () => {
    const api = new TransactInvestorAuthenticatedBrokerageApi();
    const res = await api.createWithdrawalRequest(createWithdrawalMockReq);
    expect(res.data).toBeDefined();
  });

  test('cancelDirectDebitSubscription', async () => {
    const api = new TransactInvestorAuthenticatedBrokerageApi();
    const res = await api.cancelDirectDebitSubscription({
      subscriptionId: '34343',
    });
    expect(res.data).toBeDefined();
  });
});
