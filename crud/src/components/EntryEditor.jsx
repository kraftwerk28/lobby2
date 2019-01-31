import React from 'react'
import { connect } from 'react-redux'

import {
  Paper,
  TextField,
  Grid,
  Typography
} from '@material-ui/core'


const styles = {
  paper: {
    padding: 8,
  }
}

const TextFieldWrapped = (props) => (
  <Grid item md={6} sm={12}>
    <TextField
      variant='outlined'
      helperText={props.helperText}
      value={props.value ? props.value : ''}
      onChange={props.onChange}
      fullWidth
    />
  </Grid>)

const Form = (props) => {
  const { data, onUpdate } = props

  const update = (val, key1, index2, key2) => {
    if (index2 === undefined) {
      data[key1] = val
    } else {
      data[key1][index2][key2] = val
    }

    onUpdate(data)
  }

  return (
    <Grid container spacing={16}>
      <Grid item>
        <Typography variant='h4'>{data.text}</Typography>
      </Grid>
      {Object.keys(data).map((key, i) =>
        key === 'group' ?
          <Grid item key={i}>
            <Grid container spacing={16}>
              {data[key].map((_key, _i) => (
                <>
                  <Grid item>
                    <Typography variant='h5'>{_key.text}</Typography>
                  </Grid>
                  {Object.keys(_key).map((__key, __i) =>
                    <TextFieldWrapped
                      key={__i}
                      helperText={__key}
                      value={_key[__key]}
                      onChange={e => update(e.target.value, key, _i, __key)}
                    />
                  )}
                </>



                //     < TextFieldWrapped
                //       key = { _i }
                //       helperText = { _key }
                //       value = { data[key][_key] }
                //       onChange = { e => update(e.target.value, key, _key)}
                // />
              ))}
            </Grid>
          </Grid>
          :
          <TextFieldWrapped
            key={i}
            helperText={key}
            value={data[key]}
            onChange={e => update(e.target.value, key)}
          />
      )}
    </Grid>
  )

}



const Form_ = (props) => {
  const {
    text,
    to,
    npmUrl,
    siteUrl,
    githubUrl,
    youtubeUrl,
    readme,
    group,
  } = props.data
  const { model } = props

  return (
    <Grid
      container
      spacing={16}
    >
      <Grid item xs={12}>
        <Typography align='center' variant='h4'>{text}</Typography>
      </Grid>
      <TextFieldWrapped
        helperText='Title'
        value={text}
        onChange={model('text')}
      />
      <TextFieldWrapped
        helperText='Site route'
        value={to}
        onChange={model('to')}
      />
      <TextFieldWrapped
        helperText='Site url'
        value={siteUrl}
        onChange={model('siteUrl')} />
      <TextFieldWrapped
        helperText='GitHub url'
        value={githubUrl}
        onChange={model('githubUrl')}
      />
      <TextFieldWrapped
        helperText='NPM package url'
        value={npmUrl}
        onChange={model('npmUrl')}
      />
      <TextFieldWrapped
        helperText='YouTube url'
        value={youtubeUrl}
        onChange={model('youtubeUrl')}
      />
      <TextFieldWrapped
        helperText='README.md'
        value={readme}
        onChange={model('readme')}
      />
    </Grid>
  )
}

class EntryEditor extends React.Component {
  constructor(props) {
    super(props)

  }

  changePropHandler = (key) => (evt) => {
    this.props.dispatch({
      type: 'CHANGE_ENTRY',
      index: this.props.index,
      data: { ...this.props.data, [key]: evt.target.value }
    })

  }

  updateData = (newData) => {
    this.props.dispatch({
      type: 'CHANGE_ENTRY',
      index: this.props.index,
      data: { ...newData }
    })
  }

  render() {
    console.log('render called')

    const {
      text,
      to,
      npmUrl,
      siteUrl,
      githubUrl,
      youtubeUrl,
      readme,
      group,
    } = this.props.data

    const model = this.changePropHandler

    return (
      <Grid item xs={12}>
        <Paper style={styles.paper}>
          <Form data={this.props.data} onUpdate={this.updateData} />
          {/* <Form_ data={this.props.data} model={model} /> */}

        </Paper>
      </Grid>
    )
  }
}

export default connect(
  (state, props) => ({ data: state.data[props.index] })
)(EntryEditor)
