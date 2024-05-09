import { styled, lighten } from '@mui/material/styles';
import { MaterialDesignContent } from 'notistack';

// TODO: clarify what is success color in theme and is it consistent
export const StyledSnackbar = styled(MaterialDesignContent)(({ theme }) => ({
  '&.notistack-MuiContent-error': {
    backgroundColor: lighten(theme.palette.error.light, 0.1),
  },
  '&.notistack-MuiContent-success': {
    backgroundColor: '#f3fff8',
    color: theme.palette.text.primary,
    '& > #notistack-snackbar': {
      '& > svg': {
        color: theme.palette.success.light,
      },
    },
  },
}));

// only difference is position fixed
// use this to deploy long contents , the default snarbar
// is more sutaible for short content with afew words
// but run into issue when content gets long
export const StyledLongSnackbar = styled(MaterialDesignContent)(
  ({ theme }) => ({
    '&.notistack-MuiContent': {
      paddingRight: '35px',
      '& > #notistack-snackbar + div': {
        right: 10,
        position: 'fixed',
      },
    },
    '&.notistack-MuiContent-long_error': {
      backgroundColor: lighten(theme.palette.error.light, 0.1),
      '& > #notistack-snackbar + div .MuiSvgIcon-root': {
        color: 'white',
      },
    },
    '&.notistack-MuiContent-long_success': {
      backgroundColor: '#f3fff8',
      color: theme.palette.text.primary,
      '& > #notistack-snackbar': {
        '& > svg': {
          color: theme.palette.success.light,
        },
      },
    },
  })
);

export default StyledSnackbar;
