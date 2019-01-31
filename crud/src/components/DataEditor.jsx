import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { connect } from 'react-redux'

import _fetch from '../jsonfetch'
import { CircularProgress } from '@material-ui/core'
import { getToken } from '../token'

import mainReducer from '../reducers'
import DataEditorContainer from './DataEditorContainer';

const schemaTemplate = {
  to: null,
  text: null,
  githubUrl: null,
  npmUrl: null,
  siteUrl: null,
  youtubeUrl: null,
  readme: null,
  group: null,
}

class DataEditor extends React.Component {
  state = {
    schema: null,
    dataSubmitted: true,
  }

  constructor(props) {
    super(props)

    _fetch('schema').then(_ => _.json()).then(schema => {
      this.setState({ schema: createStore(mainReducer(schema)) })
    })
  }

  handleEntryChange = (index, newData) => {
    if (this.state.dataSubmitted) {
      this.setState({ dataSubmitted: false })
    }
    this.setState(({ schema }) => {
      schema[index] = newData
      return schema
    })
  }

  submitData = () => 
     _fetch('schema', {
      body: { token: getToken(), schema: this.state.schema.getState().data }
    })

  render() {
    const { schema, dataSubmitted } = this.state
    const store = schema ? schema.getState() : null

    return (
      this.state.schema ? <Provider store={this.state.schema}>
        <DataEditorContainer onSubmitData={this.submitData} />
      </Provider> : <CircularProgress />
    )
  }
}

export default (DataEditor)
