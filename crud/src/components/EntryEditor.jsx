import React from 'react';
import { Paper, FormControlLabel, TextField, Grid, Typography } from '@material-ui/core';

const TextFieldWrapped = (props) => <Grid item md={6} sm={12}><TextField
  variant='outlined'
  helperText={props.helperText}
  value={props.value ? props.value : ''}
  onChange={props.onChange}
  fullWidth
/></Grid>;

const styles = {
  paper: {
    padding: 8,
  }
};

const Form = (props) => {
  const {
    text,
    to,
    npmUrl,
    siteUrl,
    githubUrl,
    youtubeUrl,
    readme,
    group,
  } = props.data;
  const { model } = props;

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
    super(props);

  }

  changePropHandler = (key) => (evt) => {
    this.props.onMutateData({ ...this.props.data, [key]: evt.target.value });
  }

  render() {
    const {
      text,
      to,
      npmUrl,
      siteUrl,
      githubUrl,
      youtubeUrl,
      readme,
      group,
    } = this.props.data;

    const model = this.changePropHandler;

    return (
      <Grid item xs={12}>
        <Paper style={styles.paper}>
          <Form data={this.props.data} model={model} />

        </Paper>
      </Grid>
    )
  }
}

export default EntryEditor;
