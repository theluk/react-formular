import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DataProvider, ErrorProvider } from '../context'
import { withForm } from '../withForm'

class Middleware extends Component {
  static propTypes = {
    // the middleware callback,
    // (data, update, fail) => update(data)
    use: PropTypes.func.isRequired,
    // the update callback from the parent
    // calling it means passing the data up.
    update: PropTypes.func.isRequired,
    data: PropTypes.shape(),
    children: PropTypes.node
  }

  state = {
    // holds a draft of the data that children changed
    draft: {},
    errors: {}
  }

  intercept(data) {
    const { draft, errors } = this.state
    const { use, update } = this.props

    const newDraft = {
      ...draft, ...data
    }

    const changedKeys = Object.keys(data)
    const newErrors = { ...errors }
    changedKeys.forEach(k => delete newErrors[k])

    this.setState({
      draft: newDraft,
      errors: newErrors
    })

    use(
      newDraft,
      data => update(data),
      errors => this.setState({ errors })
    )
  }

  render() {
    const { data, children } = this.props
    const { draft, errors } = this.state

    return (
      <DataProvider value={{
        data: { ...data, ...draft },
        update: this.intercept.bind(this)
      }}>
        <ErrorProvider value={{ errors }}>
          { children }
        </ErrorProvider>
      </DataProvider>
    )
  }
}

export default withForm(Middleware)
