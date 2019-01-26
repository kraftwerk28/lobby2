import { createMuiTheme } from '@material-ui/core';
import {
  orange,
  deepPurple,
  lime,
  lightGreen,
  grey
} from '@material-ui/core/colors';

export const dark = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: lightGreen.A400,
    },
    secondary: orange,
    background: {
      default: '#000',
      paper: grey[900]
    }
    
    // secondary: deepPurple,
  },
  typography: { useNextVariants: true }
});

export const light = createMuiTheme({
  palette: { type: 'light' },
  typography: { useNextVariants: true },
});
