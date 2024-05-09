import { Typography, Stack, Box, Skeleton } from '@bambu/react-ui';

import IntroductionContentButton from '../IntroductionContentButton/IntroductionContentButton';

export function IntroductionContentPreview() {
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Box display="flex" justifyContent="space-around">
          <Skeleton
            width={152}
            height={20}
            animation={false}
            sx={{ display: 'inline-block' }}
            variant="rectangular"
          />
        </Box>
        <Typography mobiletextalign="center">
          <Skeleton animation={false} variant="rectangular" />
        </Typography>
        <Typography mobiletextalign="center">
          <Skeleton animation={false} variant="rectangular" />
        </Typography>
        <Typography mobiletextalign="center">
          <Skeleton animation={false} variant="rectangular" />
        </Typography>
      </Stack>
      <IntroductionContentButton />
    </Stack>
  );
}

export default IntroductionContentPreview;
