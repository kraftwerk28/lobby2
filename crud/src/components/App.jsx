import React from 'react';
import {
  Typography,
  AppBar,
  CssBaseline,
  Tab,
  Tabs,

  MuiThemeProvider,
} from '@material-ui/core';

import VTable from './VisitTable';
import DataEditor from './DataEditor';
import JSONVisTest from '../tests/ObjForm.test';
import { dark, light } from '../themes';

const tabComponents = [
  <VTable />,
  <DataEditor />,
];

class App extends React.Component {
  constructor(props) {
    super(props);
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

export default App;
