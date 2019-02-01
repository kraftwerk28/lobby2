import React from 'react'
import { connect } from 'react-redux'

import {
  Paper,
  TextField,
  Grid,
  Typography,
  Button,
  Icon,
  IconButton
} from '@material-ui/core'


const styles = {
  paper: {
    padding: 8,
    margin: 8,
    border: '1px solid lime'
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
  },
  titleText: {
    flex: 2
  }
}

const TextFieldWrapped = (props) => (
  <Grid item md={6} xs={12}>
    <TextField
      variant='outlined'
      helperText={props.helperText}
      placeholder='null'
      value={props.value ? props.value : ''}
      onChange={e => props.onChange(e.target.value)}
      fullWidth
    />
  </Grid>
)

const Form = (props) => {
  const { data, onUpdate, level, onRemoveEntry } = props

  const setData = (key) => (newData) => {
    onUpdate({ ...data, [key]: newData })
  }

  const setDataArrayed = (key) => (index) => (newData) => {
    const arr = data[key].slice()
    arr[index] = newData
    onUpdate({ ...data, [key]: arr })
  }

  return (
    <Paper style={styles.paper}>
      <Grid container spacing={16}>
        <Grid item xs={12} style={styles.title}>
          {/* header */}
          <Typography
            inline
            align='center'
            variant={'h' + (level + 4)}
            style={styles.titleText}
          >{data.text}</Typography>

          {/* delete button */}
          {level === 0 && <IconButton
            onClick={onRemoveEntry}
          >
            <Icon>close</Icon>
          </IconButton>}

        </Grid>
        {Object.keys(data).map((key, ind) => (
          (typeof data[key] === 'object' && data[key] !== null) ?
            (
              Array.isArray(data[key]) ? (
                data[key].map((entry, _ind) => (
                  <Form
                    key={_ind}
                    level={level + 1}
                    data={entry}
                    onUpdate={setDataArrayed(key)(_ind)}
                  />
                ))
              ) :
                (
                  <Form
                    key={ind}
                    level={level + 1}
                    data={data[key]}
                    onUpdate={setData(key)}
                  />
                )
            ) :
            (
              <TextFieldWrapped
                key={ind}
                helperText={key}
                value={data[key]}
                onChange={setData(key)}
              />
            )
        ))}
      </Grid>
    </Paper>
  )
}

class EntryEditor extends React.Component {
  constructor(props) {
    super(props)
  }

  updateData = (newData) => {
    this.props.dispatch({
      type: 'CHANGE_ENTRY',
      index: this.props.index,
      data: { ...newData }
    })
  }

  removeEntry = () => {
    this.props.dispatch({
      type: 'REMOVE_ENTRY',
      index: this.props.index,
    })
  }

  render() {
    return (
      <Grid item xs={12}>
        <Form
          level={0}
          data={this.props.data}
          onUpdate={this.updateData}
          onRemoveEntry={this.removeEntry}
        />
      </Grid>
    )
  }
}

export default connect(
  (state, props) => ({ data: state.data[props.index] })
)(EntryEditor)
