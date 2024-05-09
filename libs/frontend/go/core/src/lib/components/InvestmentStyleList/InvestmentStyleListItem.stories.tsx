import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InvestmentStyleListItem } from './InvestmentStyleListItem';
import Typography from '@mui/material/Typography';

const meta: Meta<typeof InvestmentStyleListItem> = {
  component: InvestmentStyleListItem,
  title: 'Core/components/InvestmentStyleListItem',
};
export default meta;
type Story = StoryObj<typeof InvestmentStyleListItem>;

export const TitleONLY = {
  args: {
    title: <Typography>Eggs</Typography>,
  },
};

export const TitleAndDescription = {
  args: {
    title: <Typography fontWeight="bold">Eggs</Typography>,
    description: (
      <Typography>
        Eggs are superior source of protein. It has both lower gi index and
        higher protein absorption ratio than chicken breast. Further more, it by
        inhibiting hepatic biosynthesis and intestinal absorption of
        cholesterol, this is especially important for people who does inttimtent
        fasting as long term intemittent fasting is known to cause gallstones.
      </Typography>
    ),
  },
};

export const Selected = {
  args: {
    title: <Typography fontWeight="bold">Eggs</Typography>,
    selected: true,
  },
};

// Conditional rendering based on whether the item is selected
export const SelectedRenderProp = {
  args: {
    description: (selected: boolean) =>
      selected && <Typography> I have selected an egg </Typography>,
  },
};
