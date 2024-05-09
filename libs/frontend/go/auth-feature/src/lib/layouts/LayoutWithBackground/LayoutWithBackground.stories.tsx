import type { Meta, StoryObj } from '@storybook/react';
import { LayoutWithBackground } from './LayoutWithBackground';
import LoginForm from '../../components/LoginForm/LoginForm';
import { Box, Paper } from '@bambu/react-ui';
import { Header } from '@bambu/go-core';

const meta: Meta<typeof LayoutWithBackground> = {
  component: LayoutWithBackground,
  title: 'auth/layouts/LayoutWithBackground',
};
export default meta;
type Story = StoryObj<typeof LayoutWithBackground>;

export const OnItsOwn: Story = {
  args: {},
};

export const WithLoginFormWithoutContainter = {
  args: {
    children: <LoginForm />,
  },
};

export const WithLoginFormInsideContainter = {
  render: () => {
    return (
      <LayoutWithBackground>
        <Header />
        <Box p={3} display="flex" flexDirection="column">
          <Box
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
            elevation={2}
          >
            <LoginForm />
          </Box>
        </Box>
      </LayoutWithBackground>
    );
  },
};
