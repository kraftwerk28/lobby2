import React from 'react';

import _fetch from '../jsonfetch';
import { Grid, CircularProgress, Paper, IconButton, Button, Icon } from '@material-ui/core';
import EntryEditor from './EntryEditor';
import { getToken } from '../token';

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
    schema: [],
    dataSubmitted: true,
  }

  constructor(props) {
    super(props);

    _fetch('schema').then(_ => _.json()).then(schema => {
      this.setState({ schema });
    })
  }

  handleEntryChange = (index, newData) => {
    if (this.state.dataSubmitted) {
      this.setState({ dataSubmitted: false });
    }
    this.setState(({ schema }) => {
      schema[index] = newData;
      return schema;
    });
  }

  submitData = () => {
    _fetch('schema', {
      body: { token: getToken(), schema: this.state.schema }
    }).then(() => this.setState({ dataSubmitted: true }));
    // _fetch('schema', { body: this.state.schema })
    //   .then(() => this.setState({ dataSubmitted: true }));
  }

  render() {
    const { schema, dataSubmitted } = this.state;
    const spacing = 8;

    return (
      <div style={{ padding: spacing / 2 }}>
        <Grid
          container
          direction='column'
          spacing={spacing}
        >
          <Grid item xs={12}>
            <Grid container justify='center'>
              <Button
                disabled={dataSubmitted}
                onClick={this.submitData}
              >
                <Icon>{'cloud_' + (dataSubmitted ? 'done' : 'upload')}</Icon>
                Submit shanges
              </Button>
              <Button href='https://kraftwerk28.pp.ua/' target='_blank'>
                <Icon>link</Icon>
                Go to site
              </Button>
            </Grid>
          </Grid>

          {schema.length ? schema.map((entry, i) =>
            <EntryEditor
              key={i}
              data={entry}
              onMutateData={this.handleEntryChange.bind(null, i)}
            />)
            : <CircularProgress />}
        </Grid>
      </div>
    )
  }
}

export default DataEditor;
