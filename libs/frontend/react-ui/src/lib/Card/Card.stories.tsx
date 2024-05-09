import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Avatar from '../Avatar/Avatar';
import { Card } from './Card';
import type { StoryObj, Meta } from '@storybook/react';

const Story: Meta<typeof Card> = {
  component: Card,
  title: 'Card',
};
export default Story;

export const Default: StoryObj<typeof Card> = {
  render: (args) => (
    <Box sx={{ width: 360 }}>
      <Card {...args}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main' }} aria-label="header">
              H
            </Avatar>
          }
          title="Header"
          subheader="Subheader"
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
        />
        <CardMedia
          component="img"
          src="https://s3.ap-southeast-1.amazonaws.com/design-system-storybook.bambu.life/assets/media.svg"
        />
        <CardContent>
          <Stack spacing={1}>
            <Stack>
              <Typography>Title</Typography>
              <Typography variant="subtitle2" color="grey">
                Subheader
              </Typography>
            </Stack>
            <Typography variant="body2" color="grey">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor
            </Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="outlined">Enabled</Button>
          <Button variant="contained">Enabled</Button>
        </CardActions>
      </Card>
    </Box>
  ),

  args: {},
};
