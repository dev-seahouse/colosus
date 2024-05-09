import type { Meta } from '@storybook/react';
import { ApplicationHeader } from './ApplicationHeader';
import { Box, Link, SvgIcon } from '@mui/material';
import Button from '../Button/Button';

const Story: Meta<typeof ApplicationHeader> = {
  component: ApplicationHeader,
  title: 'core/components/ApplicationHeader',
};
export default Story;

export const Primary = {
  args: {
    Logo: (
      <SvgIcon viewBox="0 0 128 128">
        <path
          fill="#282D33"
          d="M80.139 103.801H47.715V55.703H30.227V23.282h67.4v32.421H80.139v48.098zm-28.424-4h24.424V51.703h17.488V27.282h-59.4v24.421h17.488v48.098zM0 23.279h5.362v4H0zM9.901 23.279h5.363v4H9.901zM19.799 23.279h5.364v4h-5.364zM102.838 23.279h5.363v4h-5.363zM112.736 23.279h5.363v4h-5.363zM122.637 23.279H128v4h-5.363zM76.139 3.551h4v5.363h-4zM76.139 13.452h4v5.364h-4z"
        />
        <g>
          <path
            fill="#282D33"
            d="M47.715 3.551h4v5.363h-4zM47.715 13.452h4v5.364h-4z"
          />
        </g>
        <g>
          <path
            fill="#282D33"
            d="M76.139 109.186h4v5.365h-4zM76.139 119.086h4v5.363h-4z"
          />
        </g>
        <g>
          <path
            fill="#282D33"
            d="M47.715 109.186h4v5.365h-4zM47.715 119.086h4v5.363h-4z"
          />
        </g>
        <g>
          <path
            fill="#282D33"
            d="M0 51.703h5.362v4H0zM9.901 51.703h5.363v4H9.901zM19.799 51.703h5.364v4h-5.364z"
          />
        </g>
        <g>
          <path
            fill="#282D33"
            d="M102.838 51.703h5.363v4h-5.363zM112.736 51.703h5.363v4h-5.363zM122.637 51.703H128v4h-5.363z"
          />
        </g>
      </SvgIcon>
    ),
  },
};

export const WithActions = {
  args: {
    ...Primary.args,
    Actions: (
      <Button
        type="button"
        data-testid="user-account-menu"
        aria-label="User's account menu"
        aria-haspopup="true"
        variant="text"
        size="large"
        color="inherit"
      >
        Nav Menu
      </Button>
    ),
  },
};

export const WithNavigation = {
  args: {
    ...Primary.args,
    children: (
      <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
        <Link>Nav 1</Link>
        <Link>Nav 2</Link>
      </Box>
    ),
  },
};

export const FullFeatured = {
  args: {
    ...WithActions.args,
    ...WithNavigation.args,
  },
};
