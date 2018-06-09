import React from 'react'

const { Provider: DataProvider, Consumer: DataConsumer } = React.createContext({
  update: null,
  data: null
})
const { Provider: ValidationProvider, Consumer: ValidationConsumer } = React.createContext()

export {
  DataConsumer,
  DataProvider,
  ValidationConsumer,
  ValidationProvider
}
