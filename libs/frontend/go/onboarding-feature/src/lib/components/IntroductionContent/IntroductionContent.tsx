import { Typography, Stack, useMediaQuery } from '@bambu/react-ui';
import type { Theme } from '@bambu/react-ui';

import IntroductionContentButton from '../IntroductionContentButton/IntroductionContentButton';
import IntroductionHeading from '../IntroductionHeading/IntroductionHeading';

export function IntroductionContent() {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md')
  );

  return (
    <Stack spacing={2}>
      {isMobile && <IntroductionHeading />}
      <Typography mobiletextalign="center">
        In just 2 minutes, you can get a personalized financial plan tailored to
        your goal so we can make them happen.
      </Typography>
      <IntroductionContentButton />
    </Stack>
  );
}

export default IntroductionContent;
