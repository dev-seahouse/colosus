/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta } from '@storybook/react';
import Typography from '@mui/material/Typography';

import useNavigatorOnline from '../../hooks/useNavigatorOnline/useNavigatorOnline';
import { NavigatorOnlineProvider } from './NavigatorOnlineProvider';

const Story: Meta<typeof NavigatorOnlineProvider> = {
  component: NavigatorOnlineProvider,
  title: 'For Developers/NavigatorOnlineProvider',
};
export default Story;

export const Default = {
  // TODO: figure out how to define hook in SB CSF 3.0
  render: () => {
    const isOnline = useNavigatorOnline();

    return (
      <NavigatorOnlineProvider>
          <Typography>
            {isOnline ? 'Switch off your wi-fi' : 'Switch on your wi-fi'}
          </Typography>
        </NavigatorOnlineProvider>
    );
  },

  args: {},
};
