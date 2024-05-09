import { createBambuTheme } from '@bambu/react-ui';

export const createGoAdvisorTheme = () =>
  createBambuTheme({
    components: {
      MuiAppBar: {
        defaultProps: {
          position: 'fixed',
        },
      },
      MuiContainer: {
        defaultProps: {
          maxWidth: false,
          fixed: true,
        },
        styleOverrides: {
          fixed: {
            width: 960,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontSize: '2rem',
            paddingTop: 0,
            lineHeight: 1.25, // 40px,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontSize: '0.75rem',
            fontWeight: 700,
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          inputSizeSmall: {
            padding: '0.35rem 0.75rem',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          h1: {
            fontSize: '2rem',
            fontWeight: 400,
          },
        },
      },
    },
  });

export default createGoAdvisorTheme;
