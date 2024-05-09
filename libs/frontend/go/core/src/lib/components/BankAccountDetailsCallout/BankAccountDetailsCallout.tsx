import Callout from '../Callout/Callout';
import { Button, ErrorLoadingData, Typography } from '@bambu/react-ui';
import { SkeletonLoading } from '../SkeletonLoading/SkeletonLoading';
import useGetDirectDebitMandates from '../../hooks/useGetDirectDebitMandates/useGetDirectDebitMandates';
import useGetBankAccountById from '../../hooks/useGetBankAccountById/useGetBankAccountById';
import { getActiveMandate } from '../../utils/getActiveMandate/getActiveMandate';
import { useState } from 'react';

interface PaymentSettingsBankAccountDetailsCalloutProps {
  onChangeDirectDebitClick: () => void;
}

export function BankAccountDetailsCallout({
  onChangeDirectDebitClick,
}: PaymentSettingsBankAccountDetailsCalloutProps) {
  const {
    data: mandates,
    isLoading: isDirectDebitMandateLoading,
    isError: isMandatesError,
  } = useGetDirectDebitMandates();

  const activeMandate = getActiveMandate(mandates);

  const {
    data: bankAccount,
    isLoading: isLoadingBankAccount,
    fetchStatus: bankAccountFetchStatus,
    isError: isBankAccountError,
  } = useGetBankAccountById(
    { bankAccountId: activeMandate?.bankAccountId ?? '' },
    { enabled: activeMandate?.bankAccountId != null }
  );

  if (isDirectDebitMandateLoading) {
    return <SkeletonLoading variant={'small'} />;
  }

  if (isLoadingBankAccount && bankAccountFetchStatus !== 'idle') {
    return <SkeletonLoading variant={'small'} />;
  }

  if (isMandatesError) {
    console.error('Error loading direct debit mandates');
    return (
      <Callout>
        <ErrorLoadingData />
      </Callout>
    );
  }

  if (isBankAccountError) {
    console.error('Error loading bank account');
    return (
      <Callout>
        <ErrorLoadingData />
      </Callout>
    );
  }

  if (!activeMandate) {
    return (
      <Callout.ContentText>
        You do not have an active mandate.
      </Callout.ContentText>
    );
  }

  const handleChangeDirectDebitClick = () => onChangeDirectDebitClick();

  return (
    <Callout>
      <Typography variant={'body1'}>Direct debit settings</Typography>
      {bankAccount ? (
        <>
          <Callout.LabelText>Full name: {bankAccount.name}</Callout.LabelText>
          <Callout.LabelText>
            Name on bank account: {bankAccount.name}
          </Callout.LabelText>
          <Callout.LabelText>
            Account number: {maskBankAccountNum(bankAccount.accountNumber)}
          </Callout.LabelText>
          <Callout.LabelText>
            Sort code: {maskSortCode(bankAccount.sortCode)}
          </Callout.LabelText>
          <Callout.LabelText>
            Mandate setup status: {mandates?.[0].status ?? 'Not setup.'}
          </Callout.LabelText>
          <Button
            variant={'text'}
            sx={{ padding: 0, fontSize: 12 }}
            type={'button'}
            onClick={handleChangeDirectDebitClick}
          >
            Change Direct Debit
          </Button>
        </>
      ) : (
        <Callout.LabelText>
          No bank account details found. Please set up a Direct Debit mandate.
        </Callout.LabelText>
      )}
    </Callout>
  );
}

export default BankAccountDetailsCallout;

function maskBankAccountNum(str: string): string {
  if (!str) {
    return '';
  }
  if (str.length <= 3) {
    return str;
  } else {
    return '*'.repeat(str.length - 3) + str.slice(-3);
  }
}

function maskSortCode(sortCode: string): string {
  return '**-**-' + sortCode.slice(-2);
}
