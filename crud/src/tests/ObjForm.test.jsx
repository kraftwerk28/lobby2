import React from 'react'
import JSONVis from '../components/json-schema'

const data = {
  hello: 'there',
  number: 123,
  array: [123, 456, 'lmao'],
  object: { a: 123, b: 456 }
}

class ObjTest extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <JSONVis data={data} />
    )
  }
}

export default ObjTest
