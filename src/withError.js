import React from 'react'
import PropTypes from 'prop-types'
import { ErrorConsumer } from './context'
import { getDisplayName } from './common'

function withError(WrappedComponent, { show = false } = {}) {
  function WithError(props) {
    // copy / leave field in props
    const { field } = props
    return (
      <ErrorConsumer>
        {
          ({ errors }) => {
            let hasError = true
            if (field !== undefined && errors.hasOwnProperty(field)) {
              props['error'] = errors[field]
            } else if (Object.keys(errors).length > 0) {
              props['errors'] = errors
            } else {
              hasError = false
            }
            if (props.hasOwnProperty('show')) {
              show = props.show
            }
            if (!hasError || show) {
              return (
                <WrappedComponent {...props} error={errors[field]} />
              )
            }
          }
        }
      </ErrorConsumer>
    )
  }

  WithError.displayName = `WithErrors(${getDisplayName(WrappedComponent)})`
  WithError.propTypes = {
    field: PropTypes.string,
    show: PropTypes.bool
  }

  return WithError
}

export {
  withError
}
