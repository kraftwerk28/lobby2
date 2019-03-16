import { createMuiTheme } from '@material-ui/core'
import {
  orange,
  deepPurple,
  lime,
  lightGreen,
  green,
  grey
} from '@material-ui/core/colors'

export const dark = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: lightGreen.A400,
    },
    secondary: grey,
    background: {
      default: '#000',
      paper: grey[900]
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'Source Code Pro Bold, monospace'
  }
})

export const light = createMuiTheme({
  palette: { type: 'light' },
  typography: { useNextVariants: true },
})
