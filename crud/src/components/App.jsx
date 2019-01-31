import React from 'react'
import {
  Button,
  FormControl,
  // Input,
  TextField,
  Typography as Txt,
  AppBar,
  CssBaseline,
  Tab,
  Tabs,
  Paper,

  MuiThemeProvider,
  createMuiTheme,
  IconButton,
  Icon,
  Toolbar
} from '@material-ui/core'

// import { Brightness5, Brightness7 } from '@material-ui/icons'

import VTable from './VisitTable'
import DataEditor from './DataEditor'
import { dark, light } from '../themes'

const tabComponents = [
  <VTable />,
  <DataEditor />
]

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  inputRef = React.createRef()
  state = { curTabIndex: 1, dark: true }

  render = () => (
    <MuiThemeProvider theme={this.state.dark ? dark : light}>
      <CssBaseline />
      <AppBar position='static'>
        <Tabs
          value={this.state.curTabIndex}
          onChange={(e, i) => this.setState({ curTabIndex: i })}
        >
          <Tab label='Visits' />
          <Tab label='Edit data' />
        </Tabs>
      </AppBar>
      {tabComponents[this.state.curTabIndex]}
    </MuiThemeProvider>
  )
}

export default App
