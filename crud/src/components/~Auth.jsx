import React from 'react';
import { hot } from 'react-hot-loader';

import {
  Button,
  FormControl,
  TextField,
  Typography as Txt,
  MuiThemeProvider,
  createMuiTheme,
  Grid,
  CssBaseline,
  Switch,
  FormControlLabel,
  Fade,
} from '@material-ui/core';


import { dark as darkTheme, light as defTheme } from '../themes';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
    this.state = {
      pwd: '',
      darkTheme: true,
    };
  };

  render = () => (
    <MuiThemeProvider
      theme={this.state.darkTheme ? darkTheme : defTheme}
    >

      <Grid
        container
        alignItems='center'
        justify='center'
        direction='column'
        style={{
          height: '100%',
        }}
      >
        <Fade in timeout={500}>
          <form
            {...process.env.NODE_ENV === 'development' ?
              {
                action: '/crud.html',
                method: 'get'
              } : {
                action: '/crud',
                method: 'post',
              }}
            style={styles.root}
          >
            <Txt
              variant='h5'
              align='center'
              color='primary'
            >Welcome to lobby2 CRUD</Txt>
            <TextField
              margin='normal'
              label='Password'
              type='password'
              name='pwd'
            />
            <Grid
              container
              direction='row'
              alignItems='center'
              justify='space-around'
            >
              <Button
                type='submit'
                variant='contained'
                color='primary'
                margin='normal'
              >Go to CRUD</Button>

              <FormControlLabel
                name='theme'
                control={
                  <Switch
                    checked={this.state.darkTheme}
                    onChange={e => this.setState({ darkTheme: e.target.checked })}
                  />}
                label='dark'
              />

            </Grid>
          </form>
        </Fade>
      </Grid>

      <CssBaseline />

    </MuiThemeProvider>
  );
}

/** @type {Object.<Object.<React.CSSProperties>>} * */
const styles = {
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitter: {
    alignSelf: 'stretch',
    display: 'flex',
    flexFlow: 'row wrap',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
};

export default hot(module)(App);
