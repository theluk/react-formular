import React from 'react'
import Middleware from './Middleware'
import PropTypes from 'prop-types'

export default class Debounce extends React.Component {
  timeout = null

  static propTypes = {
    children: PropTypes.children,
    wait: PropTypes.number
  }

  static defaultProps = {
    wait: 1
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
    this.timeout = null
  }

  clear() {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }

  onUse = (data, update) => {
    this.clear()
    this.timeout = setTimeout(() => update(data), this.props.wait)
  }

  render() {
    return (
      <Middleware use={this.onUse}>
        { this.props.children }
      </Middleware>
    )
  }
}
