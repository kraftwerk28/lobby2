import React from 'react';
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
} from '@material-ui/core';

// import { Brightness5, Brightness7 } from '@material-ui/icons';

import VTable from './VisitTable';
import { dark, light } from '../themes';

const tabComponents = [
  <VTable />,
];

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  inputRef = React.createRef();
  state = { curTabIndex: 0, dark: true };

  render = () => (
    <MuiThemeProvider theme={this.state.dark ? dark : light}>
      <CssBaseline />
      <AppBar position='static'>
        <Tabs
          value={this.state.curTabIndex}
          onChange={(e, i) => this.setState({ curTabIndex: i })}
        >
          <Tab label='Visits' />
        </Tabs>
      </AppBar>
      {tabComponents[this.state.curTabIndex]}
    </MuiThemeProvider>
  );
}

export default App;