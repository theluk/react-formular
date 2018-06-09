# react-formular


[![NPM](https://img.shields.io/npm/v/react-formular.svg)](https://www.npmjs.com/package/react-formular) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This libraray is a experimental approach to bind forms and its inputs and editors together using the new React Context API. It aims to be fully customizable and composable. All basic functionality is built using Higher Order Components.

> **ATTENTION** this is not an ui library, it is just a set of tools to bind forms and its inputs together. 

> **ATTENTION** I need help with this project, so let me know if you want to help


Some of the features are

- Uses React Context API (16.3)
- Minimalistic approach
- Loosely coupled
- Fully customizable
- Composable

## When to use it

1. So you are building a lot of user inputs, e.g in enterprise admin dashboards. You are tired of connecting your forms and inputs together, drilling your callbacks deep down the rabbit whole. Then `react-formular` let´s you build your basic set of form and input elements that are tied together and you only need to take care of the design and structure.
2. You build a UI Library and want a easy way to just include the logic of binding forms to its inputs. With `react-formular` you have full control over your components, style and structuring. 

## Install

```bash
# not published yet
npm install --save react-formular
```

## Usage

There are basically two main functionalities.

1. providing a context where data for the forms live in
2. consuming the data, transform it and send it back up
3. connecting both together 

For this there are two basic Higher-Order-Components which can be created

## 1. `provideFormular(Component)`

Let´s make our basic Form component, which we can use in our project.
It will serve as a data wrapper. You can also nest it. 

```jsx
// /src/Form.js
import React from 'react'
import { provideFormular } from 'react-formular'

export default provideFormular(({children, ...props}) => (
  <form {...props}>
    {children}
  </form>
))
```

## 2. `withFormField(Component)`

Now we need to bind some components to a parent component. `formular` makes it really easy and does not come into your way. the Higher-Order-Component `withFormField` simply passes you the `value` and `update` function you can call to update your element.

```jsx
// /src/SimpleImput.js
import React from 'react'
import { withFormField } from 'react-formular'

export default withFormField(({ update, ...props}) => (
  <input {...props} onChange={e => update(e.target.value)} />
))
```

## 3. Your bound Form

Now your `Form` and `Input` components can be used any way you like. They are tied together. More precisely the `Input` component is connected to its closest `Form` parent component. You can build dump forms that are fully controlled elsewhere.

```jsx
import React from 'react'
// /src/Form.js
import Form from './Form'
// /src/Input.js
import Input from './Input'

const MyForm = ({ firstname, lastname, onChange }) => (
  <Form initialData={{ username, password }} onChange={ onChange }>
    <Input type='text' field='username' />
    <Input type='text' field='lastname' />
  </Form>
)
```

# Todos

Currently the README does not contain every functionality

- [x] explain `provideFormular` 
- [x] explain `withFormField`
- [ ] explain `formAware`
- [ ] explain `withForm`
- [ ] explain `withValidation`
- [ ] describe Nesting
- [ ] describe data-flow
- [ ] describe guards and validation
- [ ] Build Examples
- [ ] Actual implemenations for popular UI libraries
  - [ ] Material UI
- [ ] API Reference
- [ ] Testing

## License

MIT © [theluk](https://github.com/theluk)
