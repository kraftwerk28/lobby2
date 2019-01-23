import { createMuiTheme } from '@material-ui/core';
import {
  orange,
  deepPurple
} from '@material-ui/core/colors';

export const dark = createMuiTheme({
  palette: {
    type: 'dark',
    primary: orange,
    secondary: deepPurple,
  },
  typography: { useNextVariants: true }
});

export const light = createMuiTheme({
  palette: { type: 'light' },
  typography: { useNextVariants: true },
});
