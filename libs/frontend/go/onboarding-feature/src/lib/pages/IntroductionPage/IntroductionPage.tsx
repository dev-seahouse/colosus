import type { Theme } from '@bambu/react-ui';
import { Grid, MuiLink, Typography, useMediaQuery } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';
import {
  useSelectAdvisorSubscriptionTypeQuery,
  useSelectIsUserLoggedIn,
} from '@bambu/go-core';
import OnboardingLayout from '../../layouts/OnboardingLayout/OnboardingLayout';
import IntroductionIllustration from '../../components/IntroductionIllustration/IntroductionIllustration';
import IntroductionContent from '../../components/IntroductionContent/IntroductionContent';
import IntroductionContentPreview from '../../components/IntroductionContentPreview/IntroductionContentPreview';
import IntroductionHeading from '../../components/IntroductionHeading/IntroductionHeading';
import { useEffect } from 'react';

export interface IntroductionPageProps {
  isPreview?: boolean;
}

export function IntroductionPage({ isPreview = false }: IntroductionPageProps) {
  const { data: subscriptionType } = useSelectAdvisorSubscriptionTypeQuery();
  const isUserLoggedIn = useSelectIsUserLoggedIn();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const navigate = useNavigate();
  useEffect(() => {
    if (isUserLoggedIn && !isPreview) {
      navigate('/dashboard');
    }
  }, [isUserLoggedIn, navigate]);

  return (
    <OnboardingLayout>
      <Grid container spacing={4}>
        {isDesktop && (
          <Grid item xs={12} sx={{ ml: '1.75rem' }}>
            <IntroductionHeading />
          </Grid>
        )}
        <Grid item xs={12} md={7} textAlign={'center'}>
          <IntroductionIllustration />
        </Grid>
        <Grid item xs={12} md={5} alignSelf={'center'}>
          {isPreview ? <IntroductionContentPreview /> : <IntroductionContent />}
          {subscriptionType && subscriptionType === 'TRANSACT' ? (
            <Grid
              item
              xs={12}
              md={isDesktop ? 12 : 5}
              sx={{
                display: 'flex',
                justifyContent: isDesktop ? 'left' : 'center',
                pt: '1rem',
              }}
            >
              <Typography variant="body1">
                Already have an account?{' '}
                <MuiLink
                  component="button"
                  type="button"
                  sx={{
                    pb: '5px',
                  }}
                  onClick={() => navigate('./login')}
                >
                  Log In{' '}
                </MuiLink>
              </Typography>
            </Grid>
          ) : null}
        </Grid>
        {/** For the upcoming demo, we will not offer invest with advisor, hence we will exclude the check if the user is a good/average lead and direct the user to the invest with robo flow */}
      </Grid>
    </OnboardingLayout>
  );
}

export default IntroductionPage;
