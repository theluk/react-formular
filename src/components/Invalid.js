import React from 'react'
import PropType from 'prop-types'
import { withError } from '../index'

const Invalid = withError(({ error }) => (
  <div>{ error }</div>
))

Invalid.propTypes.forField = PropType.string.isRequired

export default Invalid
