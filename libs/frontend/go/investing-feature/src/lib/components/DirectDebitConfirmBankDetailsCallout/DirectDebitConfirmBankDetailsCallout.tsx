import {
  Box,
  ErrorLoadingData,
  Link,
  Stack,
  Tooltip,
  Typography,
} from '@bambu/react-ui';
import {
  Callout,
  SkeletonLoading,
  TwoColumnLayout,
  useGetBankAccountsPaged,
  useGetInvestorProfile,
} from '@bambu/go-core';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export function DirectDebitConfirmBankDetailsCallout() {
  const {
    data: bankAccounts,
    isLoading: isBankAccountLoading,
    isSuccess: isBankAccountSuccess,
    isError: isBankAccountsError,
  } = useGetBankAccountsPaged({
    limit: 1,
  });
  const { data: email, isError: isEmailError } = useGetInvestorProfile({
    select: (data) => data.email,
  });

  if (isBankAccountLoading)
    return (
      <Callout>
        <SkeletonLoading variant={'small'} />
      </Callout>
    );

  if (isEmailError) {
    console.error('Error loading profile email');
    return (
      <Callout>
        <ErrorLoadingData />
      </Callout>
    );
  }

  if (isBankAccountsError) {
    console.error('Bank account is supposed to exist.');
    return (
      <Callout>
        <ErrorLoadingData />
      </Callout>
    );
  }

  if (isBankAccountSuccess && !bankAccounts?.results?.length) {
    console.error('Bank account is supposed to exist.');
    return (
      <Callout>
        <ErrorLoadingData />
      </Callout>
    );
  }

  const bankAccount = bankAccounts?.results?.[0];

  return (
    <Callout>
      <Stack spacing={1.3}>
        <Box display={'flex'} gap={'4px'}>
          <Typography fontSize={'11px'}>Bank details </Typography>
          <Link to={`/direct-debit-mandate-setup`} sx={{ fontSize: '11px' }}>
            change
          </Link>
        </Box>

        <TwoColumnLayout>
          <Callout.LabelText>Full name</Callout.LabelText>
          <Callout.ContentText>{bankAccount?.name}</Callout.ContentText>
        </TwoColumnLayout>

        <TwoColumnLayout>
          <Callout.LabelText>Name on bank account</Callout.LabelText>
          <Callout.ContentText>{bankAccount?.name}</Callout.ContentText>
        </TwoColumnLayout>

        <TwoColumnLayout>
          <Callout.LabelText>Account number</Callout.LabelText>
          <Callout.ContentText>
            {bankAccount?.accountNumber}
          </Callout.ContentText>
        </TwoColumnLayout>

        <TwoColumnLayout>
          <Callout.LabelText>Sort code</Callout.LabelText>
          <Callout.ContentText>{bankAccount?.sortCode}</Callout.ContentText>
        </TwoColumnLayout>

        <Typography fontSize={'11px'}>Communication details</Typography>

        <TwoColumnLayout>
          <Box display={'flex'}>
            <Callout.LabelText sx={{ display: 'inline' }}>
              Email address
              <Tooltip icon={<ErrorOutlineIcon color={'primary'} />} />
            </Callout.LabelText>
          </Box>
          <Callout.ContentText sx={{ mt: '3px' }}>{email}</Callout.ContentText>
        </TwoColumnLayout>

        <Box py={0.3}>
          <Callout.ContentText
            sx={{ lineHeight: 1.1, color: '#000', fontWeight: 500 }}
          >
            Your email address will be passed on to GoCardless Ltd.{' '}
            <Tooltip
              icon={<ErrorOutlineIcon color={'primary'} />}
              onClick={() => window.open('https://gocardless.com', '_blank')}
            />
            for them to provide notifications of activity related to your Direct
            Debit
          </Callout.ContentText>
        </Box>
      </Stack>
    </Callout>
  );
}

export default DirectDebitConfirmBankDetailsCallout;
