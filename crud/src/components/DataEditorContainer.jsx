import React from 'react';
import { connect } from 'react-redux'

import {
  Grid,
  Button,
  Icon
} from '@material-ui/core'

import EntryEditor from './EntryEditor'

const styles = {
  buttons: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 100,
  }
}

class DataEditorContainer extends React.Component {
  buttonsBar = React.createRef()
  scrollListener = () => {
    if (window.scrollY > 200) {
      this.buttonsBar.style.position = 'fixed'
    } else {
      this.buttonsBar.style.position = 'relative'
    }
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scrollListener)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListener)
  }

  submitData = () => {
    this.props.onSubmitData()
      .then(() => this.props.dispatch({ type: 'SERVER_UPDATE' }))
  }

  render() {
    const { store } = this.props
    const spacing = 8

    return (
      <div style={{ padding: spacing / 2 }}>
        <Grid
          container
          direction='column'
          spacing={spacing}
        >
          <Grid item xs={12}>
            <div ref={e => this.buttonsBar = e} style={styles.buttons}>
                <Button
                  disabled={store.serverUpdated}
                  onClick={this.submitData}
                >
                  <Icon>
                    {'cloud_' + (store.serverUpdated ? 'done' : 'upload')}
                  </Icon>
                  Submit shanges
                </Button>
                <Button href='https://kraftwerk28.pp.ua/' target='_blank'>
                  <Icon>link</Icon>
                  Go to site
                </Button>
            </div>
          </Grid>

          <Grid item><Grid container spacing={spacing}>
            {store.data.map((entry, i) =>
              <EntryEditor
                key={i}
                index={i}
              />
            )}
          </Grid></Grid>
        </Grid>
      </div>
    )
  }
}

export default connect(
  store => ({ store })
)(DataEditorContainer)
