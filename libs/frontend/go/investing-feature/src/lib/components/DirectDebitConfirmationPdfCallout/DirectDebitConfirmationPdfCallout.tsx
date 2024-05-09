import { Box, MuiLink, Stack, Tooltip } from '@bambu/react-ui';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import useGetDirectDebitMandatePdfPreview from '../../hooks/useGetDirectDebitMandatePdfPreview/useGetDirectDebitMandatePdfPreview';
import {
  Callout,
  SkeletonLoading,
  useGetBankAccountsPaged,
} from '@bambu/go-core';

export function DirectDebitConfirmationPdfCallout({
  toggleWpContactInfoDialogOpen,
}: {
  toggleWpContactInfoDialogOpen: () => void;
}) {
  const {
    data: bankAccounts,
    isLoading: isLoadingBank,
    isSuccess: isBankSuccess,
  } = useGetBankAccountsPaged({
    limit: 1,
  });

  const {
    data: pdfData,
    isLoading: isPdfLoading,
    isSuccess: isPdfSuccess,
  } = useGetDirectDebitMandatePdfPreview(
    { bankAccountId: bankAccounts?.results?.[0]?.id ?? '' },
    {
      enabled: isBankSuccess && bankAccounts?.results?.[0]?.id?.length > 0,
      retry: true,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoadingBank) {
    return (
      <Callout>
        <SkeletonLoading variant={'small'} />
      </Callout>
    );
  }

  return (
    <Callout>
      <Stack spacing={1.5}>
        <Callout.ContentText
          sx={{
            color: '#000',
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: '.2px',
          }}
        >
          Your Direct Debit will be handled by GoCardless Ltd.{' '}
          <Tooltip
            fontSize={'13px'}
            icon={<ErrorOutlineIcon color={'primary'} />}
            onClick={() => window.open('https://gocardless.com', '_blank')}
          />{' '}
          and you will see WealthKernel{' '}
          <Tooltip
            fontSize={'13px'}
            onClick={toggleWpContactInfoDialogOpen}
            icon={<ErrorOutlineIcon color={'primary'} />}
          />{' '}
          on your bank statement for any Direct Debit payments your request to
          fund your portfolio.
        </Callout.ContentText>
        {isPdfLoading || isLoadingBank ? (
          <SkeletonLoading variant={'small'} />
        ) : isPdfSuccess ? (
          <Box display={'flex'} alignItems={'center'} gap={'5px'}>
            <PictureAsPdfIcon sx={{ fontSize: '1rem' }} color={'primary'} />
            <MuiLink
              sx={{ fontSize: '11px' }}
              href={pdfData?.dataUrl}
              download
              underline="hover"
            >
              Your Direct Debit mandate
            </MuiLink>
          </Box>
        ) : (
          <Callout.ContentText>Error loading document</Callout.ContentText>
        )}
        <Callout.ContentText
          sx={{ fontWeight: 500, letterSpacing: '.2px', lineHeight: '1.5' }}
        >
          The document above contains the details of your Direct Debit mandate.
          Feel free to save a copy and we will add it to your documents store
          once you accept the Direct Debit mandate.
        </Callout.ContentText>
      </Stack>
    </Callout>
  );
}
export default DirectDebitConfirmationPdfCallout;
