import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  TextField as Input,
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
  };

  getToken = async () => {
    const token = await setToken(this.state.pwd);
    if (token !== null) {
      // console.log('Auth successfull!');
      this.props.onPwdEnter();
      // this.setState({ dialogOpen: false });

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
          <Input
            type='password'
            placeholder='password'
            onChange={(e) => this.setState({ pwd: e.target.value })}
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
