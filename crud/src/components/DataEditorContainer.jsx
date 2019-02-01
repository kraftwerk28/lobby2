import React from 'react';
import { connect } from 'react-redux'

import {
  Grid,
  Button,
  Icon,
  Paper,
  Fab,
  Zoom
} from '@material-ui/core'

import EntryEditor from './EntryEditor'

const styles = {
  buttons: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    margin: 8,
    display: 'flex',
    justifyContent: 'space-evenly',
    zIndex: 100,
  },
  fab: {
    position: 'fixed',
    bottom: 8,
    right: 8,
  }
}

class DataEditorContainer extends React.Component {
  state = {
    gotoTopShown: false,
  }

  scrollListener = () => {
    if (window.scrollY > 200) {
      if (!this.state.gotoTopShown) {
        this.setState({ gotoTopShown: true })
      }
    } else if (this.state.gotoTopShown) {
      this.setState({ gotoTopShown: false })
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

  goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  submitData = () => {
    this.props.onSubmitData()
      .then(() => this.props.dispatch({ type: 'SERVER_UPDATE' }))
  }

  addEntry = () => {
    this.props.dispatch({ type: 'ADD_ENTRY' })
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

          {/* top buttons */}
          <Grid item xs={12}>
            <div ref={e => this.buttonsBar = e} style={styles.buttons}>
              <Button
                variant='outlined'
                color='primary'
                disabled={store.serverUpdated}
                onClick={this.submitData}
              >
                <Icon>
                  {'cloud_' + (store.serverUpdated ? 'done' : 'upload')}
                </Icon>
                {'Submit shanges'}
              </Button>

              <Button
                variant='outlined'
                color='primary'
                href='https://kraftwerk28.pp.ua/'
                target='_blank'
              >
                <Icon>link</Icon>
                {'Go to site'}
              </Button>

              <Button
                variant='outlined'
                color='primary'
                onClick={this.addEntry}
              >
                <Icon>playlist_add</Icon>
                {'Add entry'}
              </Button>

            </div>
          </Grid>

          {/* content */}
          <Grid item>
            <Grid container spacing={spacing}>
              {store.data.map((entry, i) =>
                <EntryEditor
                  key={i}
                  index={i}
                />
              )}
            </Grid>
          </Grid>

          {/* FAB */}
          <Zoom
            in={this.state.gotoTopShown}
            timeout={500}
          >
            <Fab
              style={styles.fab}
              color='primary'
              onClick={this.goToTop}
            >
              <Icon>expand_less</Icon>
            </Fab>
          </Zoom>

        </Grid>
      </div>
    )
  }
}

export default connect(
  store => ({ store })
)(DataEditorContainer)
