import { Drawer, Box, IconButton, Typography, Stack } from '@bambu/react-ui';
import type { DrawerProps } from '@bambu/react-ui';
import CloseIcon from '@mui/icons-material/Close';
import type { ReactNode } from 'react';
import GoAppPreview from './GoAppPreview';

export interface GoAppPreviewDrawer {
  children?: DrawerProps['children'];
  anchor?: DrawerProps['anchor'];
  open?: DrawerProps['open'];
  onClose?: () => void;
  title?: ReactNode;
  content?: ReactNode;
}

export const GoAppPreviewDrawer = ({
  children,
  anchor = 'right',
  open,
  onClose,
  title = 'Robo preview',
  content,
}: GoAppPreviewDrawer) => (
  <Drawer
    anchor={anchor}
    open={open}
    PaperProps={{
      sx: {
        pt: 8,
        minWidth: 458,
      },
    }}
  >
    <Box display="flex" justifyContent="flex-end" py={3} pl={4} pr={2}>
      <IconButton onClick={onClose} aria-label="close preview drawer">
        <CloseIcon />
      </IconButton>
    </Box>
    <Stack spacing={4} px={4}>
      <Stack spacing={2}>
        <Typography variant="h5">{title}</Typography>
        {content ? <Typography>{content}</Typography> : null}
      </Stack>
      <Box display="flex" justifyContent="space-around">
        <GoAppPreview>{children}</GoAppPreview>
      </Box>
    </Stack>
  </Drawer>
);

export default GoAppPreviewDrawer;
