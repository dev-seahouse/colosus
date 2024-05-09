import { Box, Button, Card, Link, Stack, Typography } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const documentList = [
  'Company memorandum',
  'Articles of association',
  'Organization chart',
  'Regulatory business plan',
  'For each company director:',
];

const companyDirectorDetails = [
  'Name',
  'Address',
  'Date of birth',
  'Proof of identity: Passport / driving license',
  'Proof of address: Utility bill',
];

export const GetVerifiedInstructions = () => {
  const navigate = useNavigate();

  return (
    <Card sx={{ py: '4rem', px: '4rem' }}>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography>Step 1</Typography>
          <Typography variant="h6" fontWeight="bold">
            KYC/AML verification
          </Typography>
        </Stack>
        <Stack>
          <Typography>
            Please prepare the following information & documents and send them
            via email to{' '}
            <Link to="mailto:kyc@wealthkernel.com">kyc@wealthkernel.com</Link>
          </Typography>
        </Stack>
        <Stack>
          <ul>
            {documentList.map((doc, index) =>
              index === documentList.length - 1 ? (
                <>
                  <li
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    {doc}
                  </li>
                  <ul>
                    {companyDirectorDetails.map((detail) => (
                      <li>{detail}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <li>{doc}</li>
              )
            )}
          </ul>
        </Stack>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back to previous screen
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};

export default GetVerifiedInstructions;
