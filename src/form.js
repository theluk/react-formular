import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DataProvider, getDisplayName, formAware } from './index'

function provideFormular(WrappedComponent) {
  class ProvideFormular extends Component {
    static displayName = `WithForm(${getDisplayName(WrappedComponent)})`

    static propTypes = {
      onChange: PropTypes.func,
      initialData: PropTypes.shape()
    }

    constructor({initialData = {}}) {
      super()
      this.state = {data: initialData}
    }

    onUpdate(field, value) {
      const { onChange } = this.props
      const { data } = this.state
      const newData = {
        ...data,
        [field]: value
      }

      onChange(newData)

      this.setState({data: newData})
    }

    render() {
      const { data } = this.state
      const { onChange, initialData, ...props } = this.props

      return (
        <DataProvider value={{
          data,
          update: this.onUpdate.bind(this)
        }}>
          <WrappedComponent {...props} />
        </DataProvider>
      )
    }
  }

  return formAware(
    ({ data, update, field, ...props }) => {
      if (field === undefined && typeof update === 'function') {
        throw new Error('Nested form usage without field specification')
      }
      props = {
        initialData: field !== undefined && data.hasOwnProperty(field) ? data[field] : null,
        onChange: newData => update(field, newData),
        ...props
      }

      return (
        <ProvideFormular {...props} />
      )
    },
    'Formular'
  )
}

export {
  provideFormular
}
