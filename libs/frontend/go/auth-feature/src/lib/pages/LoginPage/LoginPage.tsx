import { GoAppLayout } from '@bambu/go-core';
import { Paper, Box, Container } from '@bambu/react-ui';
import LoginForm from '../../components/LoginForm/LoginForm';
import LayoutWithBackground from '../../layouts/LayoutWithBackground/LayoutWithBackground';
import {
  selectAccessToken,
  selectIsAccessTokenExpired,
} from '@bambu/api-client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function LoginPage() {
  const accessToken = selectAccessToken();
  const navigate = useNavigate();
  const isAccessTokenExpired = selectIsAccessTokenExpired();

  useEffect(() => {
    if (accessToken && !isAccessTokenExpired) {
      navigate('/dashboard');
    }
  }, [accessToken, isAccessTokenExpired]);

  return (
    <LayoutWithBackground>
      <GoAppLayout>
        <Container>
          <Box
            elevation={2}
            component={Paper}
            sx={(theme) => ({
              px: [3, 8],
              py: [3, 8],
              // 395px is the height of the element,
              // this formula ensures that the element does not have large
              // top empty space on large device and does not break (overflows) on small devices
              mt: 'clamp(10px, calc((100vh - 395px - 180px) / 2), ( 395px + 180px  )/4)',
              maxWidth: theme.breakpoints.values.sm,
              mx: 'auto',
            })}
          >
            <LoginForm />
          </Box>
        </Container>
      </GoAppLayout>
    </LayoutWithBackground>
  );
}

export default LoginPage;
