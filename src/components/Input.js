import React from 'react'
import { withFormField } from '../index'

export default withFormField(
  ({ update, ...props }) => (
    <input {...props} onChange={e => update(e.target.value)} />
  )
)
