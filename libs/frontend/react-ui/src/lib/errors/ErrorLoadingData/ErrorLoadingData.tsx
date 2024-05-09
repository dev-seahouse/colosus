import { Box } from '@mui/material';
import Button from '../../Button/Button';
import Typography from '../../Typography/Typography';
import LoadingErrorIcon from '../assets/icons/LoadingErrorIcon';
import type { MouseEventHandler } from 'react';

// TODO: Make the icon configurable when there is a need
export interface ErrorLoadingDataProps {
  title?: string;
  description?: string;
  allowAction?: boolean;
  actionButtonText?: string;
  actionPrompt?: string;
  onActionClick?: MouseEventHandler<HTMLButtonElement>;
}

export function ErrorLoadingData({
  title = 'Unable to load the data',
  description = 'This section is not loading correctly',
  allowAction = false,
  actionButtonText = 'Try again',
  actionPrompt = 'Please reload the page by clicking the "Try again" button',
  onActionClick = (e) => {
    window.location.reload();
  },
}: ErrorLoadingDataProps) {
  return (
    <Box
      p={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
      flexShrink={0}
    >
      <LoadingErrorIcon style={{ height: 60, width: 60 }} />
      <Typography mt={2} mb={2} fontWeight={700}>
        {title}
      </Typography>
      <Typography>{description}</Typography>
      {allowAction && (
        <>
          <Typography style={{ width: '75%' }} mb={3}>
            {actionPrompt}
          </Typography>
          <Button
            variant="outlined"
            onClick={onActionClick}
            style={{ minWidth: 160 }}
          >
            {actionButtonText}
          </Button>
        </>
      )}
    </Box>
  );
}

export default ErrorLoadingData;
