import type { Meta, StoryObj } from '@storybook/react';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import { MobilePreview } from './MobilePreview';
import MobilePreviewThemeProvider from './MobilePreviewThemeProvider';

const Story: Meta<typeof MobilePreview> = {
  component: MobilePreview,
  title: 'MobilePreview',
};
export default Story;

export const Default = {
  args: {},
};

export const WithExtraLongContent = {
  args: {
    children: (
      <Typography>
        Bacon ipsum dolor amet kevin biltong spare ribs, jowl doner pig tongue.
        Short loin tri-tip buffalo spare ribs porchetta. Short ribs jerky t-bone
        beef ribs flank. Doner buffalo short loin spare ribs drumstick ham. Ham
        hock leberkas kevin shank pork chop shankle. Spare ribs rump pork chop,
        tail turducken tongue meatball meatloaf corned beef bacon chuck tri-tip
        burgdoggen beef ribs. <br /> Hamburger tenderloin frankfurter corned
        beef. Porchetta fatback landjaeger ribeye burgdoggen, short loin bacon
        pork belly turducken swine shankle. Meatloaf cow chicken swine filet
        mignon, pastrami capicola alcatra leberkas turducken landjaeger ham hock
        fatback pork belly sirloin. Beef pork loin buffalo, ground round sausage
        doner cow brisket rump salami shank chislic shoulder. Short loin
        turducken ham t-bone tail tongue shoulder. Corned beef turducken jerky
        porchetta cupim burgdoggen. <br /> Jerky meatloaf beef ribs pancetta
        t-bone bacon short ribs porchetta tongue picanha. Pastrami short loin
        ball tip, spare ribs pork loin rump jerky porchetta corned beef bacon
        sirloin tri-tip chuck ribeye chicken. Ribeye kielbasa tri-tip pork belly
        pork pastrami cow t-bone doner strip steak shoulder bresaola tenderloin
        pork chop.
      </Typography>
    ),
  },
};

export const WithMobilePreviewThemeProvider: StoryObj<typeof MobilePreview> = {
  args: {
    children: (
      <Typography>I am wrapped with mobile preview theme provider</Typography>
    ),
  },
  decorators: [
    (Story) => (
      <MobilePreviewThemeProvider>{Story()}</MobilePreviewThemeProvider>
    ),
  ],
};

export const ExtendedMobilePreviewThemeProvider: StoryObj<
  typeof MobilePreview
> = {
  args: {
    children: (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography>Voila!</Typography>
          </Toolbar>
        </AppBar>
        <Typography>
          Extended MobilePreviewThemeProvider with some default color for
          Typography
        </Typography>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <MobilePreviewThemeProvider
        theme={{
          components: { MuiTypography: { defaultProps: { color: 'primary' } } },
        }}
      >
        {Story()}
      </MobilePreviewThemeProvider>
    ),
  ],
};
