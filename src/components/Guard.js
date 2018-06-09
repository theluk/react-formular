import React, { Fragment } from 'react'
import { withValidation } from '../index'

export default withValidation(({ children }) => (
  <Fragment>
    { children }
  </Fragment>
))
