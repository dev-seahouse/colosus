import {
  Box,
  Button,
  Card,
  lighten,
  Link,
  Stack,
  styled,
  Typography,
} from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';
import StepOneIcon from './assets/StepOneIcon';
import StepTwoIcon from './assets/StepTwoIcon';
import SuccessIcon from './assets/SuccessIcon';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useSelectKycStatus } from '@bambu/go-advisor-core';

export const BoxWithLightenedPrimaryColor = styled(Box)(({ theme }) => ({
  backgroundColor: lighten(theme.palette.primary.main, 0.9),
}));

export const GetVerifiedInstructions = () => {
  const navigate = useNavigate();
  const { data: kycStatus } = useSelectKycStatus();
  const kycConfigurationInProgress =
    kycStatus && kycStatus === 'CONFIGURATION_IN_PROGRESS';
  const kycStatusActive = kycStatus && kycStatus === 'ACTIVE';

  return (
    <Stack>
      <Card sx={{ px: '4rem', py: '8rem' }}>
        <Stack spacing={4}>
          <Typography variant="h5" fontWeight="bold">
            You need to go through the following steps to get verified
          </Typography>
          <Stack direction="row" alignItems="flex-start">
            <Stack justifyContent="center" alignItems="center" spacing={6}>
              {kycConfigurationInProgress || kycStatusActive ? (
                <SuccessIcon />
              ) : (
                <StepOneIcon />
              )}
              <span
                style={{
                  width: '64px',
                  height: '2px',
                  border: '1px',
                  transform: 'rotate(90deg)',
                  background: '#E5E7EB',
                }}
              />
              <StepTwoIcon />
            </Stack>
            <Stack spacing={4}>
              <Stack spacing={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    KYC/AML verification
                  </Typography>
                  <Typography variant="subtitle2" color="#3F4945">
                    During this step, we will need to verify that your company
                    is legally allowed to provide financial services in the UK.
                    You will be liaising directly with our custodian, Wealth
                    Kernel{' '}
                    <Link
                      sx={{ textDecoration: 'underline', color: 'inherit' }}
                      target="_blank"
                      rel="noopener"
                      to={
                        'https://register.fca.org.uk/s/firm?id=001b000002090oWAAQ'
                      }
                    >
                      (FCA no. 723719).
                    </Link>
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Custodian onboarding: Meeting & signing of agreement with
                    Wealth Kernel
                  </Typography>
                  <Typography variant="subtitle2" color="#3F4945">
                    Next, you will need to sign an agreement directly with the
                    custodian, Wealth Kernel. Once this is completed, you may
                    set up and launch your transactional robo-advisor.
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack>
            {kycConfigurationInProgress || kycStatusActive ? (
              <BoxWithLightenedPrimaryColor
                p={2}
                role="alert"
                data-testid="setup-contribution-recommendation"
              >
                <Stack direction="row" spacing={1}>
                  <LightbulbIcon
                    sx={{
                      color: '#00876a',
                      fontSize: 24,
                    }}
                  />

                  <Box display="flex">
                    <Typography>
                      Keep a look out for an email invitation from Wealth
                      Kernel. The details of this step will be included in it.
                    </Typography>
                  </Box>
                </Stack>
              </BoxWithLightenedPrimaryColor>
            ) : null}
          </Stack>
          {kycStatusActive || kycConfigurationInProgress ? null : (
            <Box>
              <Button onClick={() => navigate('./instructions')}>
                Start with the KYC/AML verification
              </Button>
            </Box>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};

export default GetVerifiedInstructions;
