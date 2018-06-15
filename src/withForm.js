import React from 'react'
import { DataConsumer } from './context'
import { getDisplayName } from './common'

/**
 * formAware creates a function which
 * returns a Component that calls the
 * specified parameter with the formular props
 * (update and data) and the passed props
 */
function formAware(handler, displayName) {
  function FormAware(props) {
    return (
      <DataConsumer>
        { ({ data, update }) => handler({ ...props, data, update }) }
      </DataConsumer>
    )
  }
  if (displayName !== undefined) {
    FormAware.displayName = displayName
  }
  return FormAware
}

/**
 * returns a connected Component which receives
 * the form props (update and data) and value of
 * the specified field
 */
function withFormField(WrappedComponent) {
  return formAware(
    ({ data, update, field, ...props }) => (
      <WrappedComponent
        {...props}
        value={data[field]}
        update={value => update({ [field]: value })}
      />
    ),
    `WithFormField(${getDisplayName(WrappedComponent)})`
  )
}

/**
 * creates a basic connected (form-aware) component
 * that receives the update and data props
 */
function withForm(WrappedComponent) {
  return formAware(
    props => (
      <WrappedComponent {...props} />
    ),
    `WithForm(${getDisplayName(WrappedComponent)})`
  )
}

export {
  formAware,
  withForm,
  withFormField
}
