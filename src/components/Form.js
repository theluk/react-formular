import React from 'react'
import { provideFormular } from '../index'

export default provideFormular(
  ({ children, props }) => (
    <form {...props}>
      { children }
    </form>
  )
)
