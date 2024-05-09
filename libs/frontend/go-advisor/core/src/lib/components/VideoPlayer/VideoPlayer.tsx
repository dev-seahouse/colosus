import {
  CardActionArea,
  CardMedia,
  Dialog,
  DialogContent,
} from '@bambu/react-ui';
import { useState } from 'react';
import ReactPlayer from 'react-player/youtube';

import { VIDEO_THUMBNAIL, VIDEO_URL } from '../../constants/videos';
import type { VideoType } from '../../constants/videos';

export interface VideoPlayerProps {
  type?: VideoType;
}

export function VideoPlayer({ type = 'Branding' }: VideoPlayerProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <CardActionArea
        onClick={handleClickOpen}
        aria-label={`play ${type} video`}
      >
        <CardMedia
          component="img"
          loading="lazy"
          src={VIDEO_THUMBNAIL[type]}
          alt={`${type} thumbnail`}
          sx={{
            width: 256,
            height: 144,
          }}
        />
      </CardActionArea>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent
          sx={{ p: 5, display: 'flex', justifyContent: 'space-around' }}
        >
          <ReactPlayer url={VIDEO_URL[type]} playing />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default VideoPlayer;
