import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  FormControl,
  TextField,
  Button,
  MuiThemeProvider

} from '@material-ui/core';

import { dark } from '../themes';

import { getToken, setToken } from '../token';

class TokenDialog extends React.Component {
  constructor(props) {
    super(props);

  }

  state = {
    pwd: '',
    dialogOpen: true,
    pwdError: false,
  };

  getToken = async () => {
    const token = await setToken(this.state.pwd);
    if (token !== null) {
      this.props.onPwdEnter();
    } else {
      this.setState({ pwdError: true });
    }
  }

  render = () => (
    <MuiThemeProvider theme={dark}>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={this.state.dialogOpen}
      >
        <DialogTitle>Log in</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>Enter password below:</DialogContentText> */}
          <TextField
            margin='normal'
            autoFocus
            variant='outlined'
            type='password'
            error={this.state.pwdError}
            label={'password'}
            onChange={(e) =>
              this.setState({ pwd: e.target.value, pwdError: false })}
            onKeyPress={(e) => { if (e.key === 'Enter') { this.getToken() } }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color='primary'
            onClick={this.getToken}
          >Submit</Button>
        </DialogActions>
      </Dialog>
    </MuiThemeProvider>
  )

}

export default TokenDialog;
