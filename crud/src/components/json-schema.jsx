import React from 'react'

import {
  Paper,
  TextField,
  List,
  ListItem,

  Collapse,

  Button,
  Icon
} from '@material-ui/core'

const Wrapper = (props) => (
  <Paper style={{ border: '1px solid lime' }}>
    {props.children}
  </Paper>
)

const TextFieldHO = (props) => (
  <TextField
    helperText={props._key}
    value={props._value}
    variant='filled'
    placeholder='null'
  />
)

const ObjForm = (props) => {
  const { _key, _value } = props

  const mapper = () => {
    if (typeof _value === 'object' && _value !== null) {
      if (Array.isArray(_value)) {
        // array
        return (
          <Wrapper>
            {_value.map((entry, index) => (
              <ObjForm
                key={index}
                _key={null}
                _value={entry}
              />
            ))}
          </Wrapper>
        )
      } else {
        // object
        return (
          <Wrapper>
            {Object.keys(_value).map((subkey, index) => (
              <ObjForm
                key={index}
                _key={subkey}
                _value={_value[subkey]}
              />
            ))}
          </Wrapper>
        )
      }
    } else {
      // string
      return (
        <TextFieldHO _key={_key} _value={_value} />
      )
    }
  }

  return (
    mapper()
  )
}

class JSONSchema extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data } = this.props

    return (
      <Paper>
        {(typeof data === 'object' && data !== null) ? (
          Array.isArray() ?
            data.map((k, i) => (
              <ObjForm key={i} _key={null} _value={k} />
            ))
            :
            Object.keys(data).map((k, i) => (
              <ObjForm key={i} _key={k} _value={data[k]} />
            ))

        ) : <ObjForm _key={null} _value={data} />
        }
      </Paper>
    )
  }
}

export default JSONSchema
