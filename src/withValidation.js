import React, { Component } from 'react'
import PropTypes from 'prop-types'
import equal from 'shallow-equals'
import { DataProvider, ValidationProvider, ValidationConsumer } from './context'
import { withForm } from './withForm'
import { getDisplayName } from './common'

/**
 * create a component that consumes the
 * data and update props from the basic formAware contexts
 * and creates a validation proxy. It creates a new
 * form provider, so descendants consume the proxy instead
 * the original context. this way ths component
 * can act like a guard or middleware.
 */
function withValidation(WrappedComponent) {
  class WithValidation extends Component {
    static propTypes = {
      update: PropTypes.func.isRequired,
      onValidate: PropTypes.func
    }

    static defaultProps = {
      onValidate: async () => [true, null],
      update: () => {}
    }

    state = {
      data: {},
      draft: {},
      errors: {}
    }

    static getDerivedStateFromProps({ data }, state) {
      if (equal(data, state.data)) {
        return state
      }

      return {
        data: { ...data },
        draft: { ...data, ...state.draft }
      }
    }

    async tryUpdate(field, value) {
      const [isValid, errors] = await this.props.onValidate(field, value)
      console.log(errors)

      // update the draft always
      this.setState({
        errors: errors || {},
        draft: {
          ...this.state.draft,
          [field]: value
        }
      })

      // if we are valid, call the main update func
      if (isValid) {
        this.props.update(field, value)
      }
    }

    render() {
      const { update, ...props } = this.props
      const { draft, errors } = this.state

      return (
        <DataProvider value={{ data: draft, update: this.tryUpdate.bind(this) }}>
          <ValidationProvider value={{ errors }}>
            <WrappedComponent {...props} />
          </ValidationProvider>
        </DataProvider>
      )
    }
  }

  return withForm(WithValidation, `WithValidation(${getDisplayName(WrappedComponent)}`)
}

function withError(WrappedComponent) {
  function WithError({ forField, ...props }) {
    return (
      <ValidationConsumer>
        {
          ({ errors }) => {
            console.log(forField, errors)
            if (forField !== undefined && errors.hasOwnProperty(forField)) {
              console.log('returing error component')
              return (
                <WrappedComponent {...props} error={errors[forField]} />
              )
            } else if (Object.keys(errors).length > 0) {
              return (
                <WrappedComponent {...props} errors={errors} />
              )
            }
          }
        }
      </ValidationConsumer>
    )
  }

  WithError.displayName = `WithErrors(${getDisplayName(WrappedComponent)})`
  WithError.propTypes = {
    forField: PropTypes.string
  }

  return WithError
}

export {
  withValidation,
  withError
}
