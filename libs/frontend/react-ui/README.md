# BAMBU React UI

This library contains the collection of React UI components usually required to start a BAMBU project.

NOTE:

At the moment, most of the components are re-exported from [@mui/material](https://mui.com/). This library serves as a wrapper for the components to provide an interface and to add additional features.

## Storybook URL

[BAMBU Design System Storybook](https://design-system.bambu.life/)

## Installation

```
TBD
```

## Folder Structure

``` 
src/
  |- libs/
  | |- [ComponentName]/
  | | |- <React component & Stories>
  | |- utils/
  | | |- <design system utilities>
```

## Usage

### Setting Up BAMBU Design System

```typescript
import { ThemeProvider } from '@bambu/react-ui';

const theme = createBambuTheme();

const App = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
); 
```
If the design system is not initialised, default material-ui theme will be used instead.

### Overriding Theme

```typescript
import { createBambuTheme, ThemeOptions } from '@bambu/react-ui';

const myTheme: ThemeOptions = {
  // your theme goes here
};

const theme = createBambuTheme(myTheme);
```

`createBambuTheme` function will selectively apply the custom theme options provided. Any non-overridden options will be defaulted to the original design system's value.

### Using NavigatorOnlineProvider to detect browser's online status

In your main component, wrap the component with `NavigatorOnlineProvider` and `SnackbarProvider` to enable the online status detection and snackbar notifications.

```typescript
import { SnackbarProvider, NavigatorOnlineProvider } from '@bambu/react-ui'; 

const App = () => (
    <SnackbarProvider>
      <App />
      <NavigatorOnlineProvider/>
    </SnackbarProvider>
); 
```
