# react-formular

[![NPM](https://img.shields.io/npm/v/react-formular.svg)](https://www.npmjs.com/package/react-formular) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This libraray is an experimental approach to bind forms and its inputs and editors together using the new React Context API. It aims to be fully customizable and composable. It´s only a set of Higher-Order-Components.

Because of the decoupled nature, [**Middlewares**](#middlewarecomponent) makes it easy to build custom Validations, Security Guards and other data interceptors.  

> **ATTENTION** this is not an ui library, it is just a set of tools to bind forms and its inputs together. 

> **ATTENTION** I need help with this project, so let me know if you want to help


## Focus / Motivation / Features

- Uses React Context API (requires 16.3)
- Minimalistic approach
- validation-as-[**middleware**](#middlewarecomponent) approach  
- Does not tell you how to design
- Helps you with data flow only
- Decouple form, validation and inputs completely from each other
- Built as composable Higher-Order-Components
- Focus on pure & stateless components
- Support nesting
- Support unopinionated validation

## Overview of the API

  - [provideFormular](#provideformular)
  - [withFormField](#withformfield)
  - [formAware](#formaware)
  - [withForm](#withform)
  - [Middleware](#middlewarecomponent ) Component
  - [Validation](#validation)

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

# `provideFormular`

provides the data context and returns a HOC in which you can pass `initialData` and `onChange`

```jsx
import React from 'react'
import { provideFormular } from 'react-formular'

const Form = provideFormular(({children, ...props}) => (
  <form {...props}>
    {children}
  </form>
))

// how to use
render(
  <Form initialData={data} onChange={newData => console.log(newData)} />
)
```

# `withFormField`

creates an connected HOC which can be bound to a specific property in the data object. 
The WrappedComponent wil receive the `value` and the field-bound `update` function.

```jsx
// Example of a connected Input 
import React from 'react'
import { withFormField } from 'react-formular'

const SimpleField = withFormField(({ value, update, ...props}) => (
  <input {...props} value={value} onChange={e => update(e.target.value)} />
))

// how to use
render(
  <Form initialData={data} onChange={newData => console.log(newData)}>
    <SimpleField field="myProperty" type="text" />
  </Form>
)
```

# `formAware`

creates a helper HOC that is a `formular` data consumer. 
It expects a function as first argument that will be called with and that function should
return a new Element.

```js
{
  // the data from a `formular` context 
  "data": {},
  // the update function to call on change
  "update": (field | newData = {}, value: undefined) => { /*...*/ },
  // other props that will be passed when the HOC is created
  ...props
}
```

It helps you with building Components that need full access to the form data.
the HOC `withFormField` uses it under the hood to connect it to one single field.

```jsx
  const FormAwareComponent = formAware(
    ({ data, update, ...props }) => (
      // consume data, call update
    )
  )
```

# `withForm`

A convenient function that uses `formAware`. It in constrast supports non-functional components.

```jsx
  const ResetButton = withForm(({ update, ...props }) => (
    return (<Button {...props} onClick={ update({}) }>Reset</Button>)
  ))
```

# `Middleware`Component 

a Middleware Component is an easy way to step into the update process of the data flow. 
Data flows for example from an Input to the Form. So in case you want to check if the data that flows
is correct, you can step in the middle and check the data. You can also think of it as an way to validate your data, 
but I named it Middleware, because I think there is more than validation. 

the `Middleware` component expects the `use` prop which will be called as follows: `(data, update, fail) => ...`

+ `data`            is the changed data from descending components
+ `update(data)`    is a function you should call with the data that need to be commited
+ `fail(errors)`    as a function you should call with an object, where very key is the field having an error

#### simple (direct) usage
```jsx
const update = (data) => console.log(data)

(
  <Form onChange={update}>
    <Middleware use={(data, update, fail) => (/*...*/)}>
      <Input />
    </Middleware>
  </Form>
)
```

# Validation

`react-formular` does not tell you how or where to validate your data. But this library gives you a usefull helper. It´s the `Middleware`Component and you can use it to build a Validator. 

#### example

```jsx
import { validate } from 'email-validator'

const EmailValidator = ({
  field, children, errorMessage = 'Please use a correct email'
}) => (
  <Middleware use={(data, update, fail) => {
    if (validate(data[field])) {
      update(data)
    } else {
      fail({[field]: errorMessage})
    }
  }}>
    { children }
  </Middleware>
)
```

# `withError`

creates a HOC that passes you the `error` or the `errors` props. 
If you build your Component with the `field` prop, then your ErrorComponent will only 
be called when the actual field is invalid and only the `error` prop will be set. 
If you do not specify the `field` prop, then you will receive the `errors` prop, which will be an object with all the field => errorMessage key-value pairs. 

```jsx
// An Label for a single field error
const ErrorLabel = withError(({error}) => (
  <div className="has-error">
    { error }
  </div>
))
```

```diff
render(
  <Form initialData={data} onChange={onChange}>
    <Validator onValidate={onValidate}>
      <Input field="hello" type="text" />
+     <ErrorLabel field="hello" />
      <Input field="world" type="text" />
+     <ErrorLabel field="world" />
    </Validator>
  </Form>
)
```

you can also build an input element so it recevices the error for the field.

```jsx

const RawInput = ({ value, update, error, className = '', ...props }) => (
  <input 
    {...props} 
    className={`${className} ${error ? 'has-error' : ''}`}
    value={value} 
    data-error={error}
    onChange={e => update(e.target.value)} 
  />
)

const SimpleField = withError(withFormField(RawInput))
```

# Todos

Currently the README does not contain every functionality

- [x] explain `provideFormular` 
- [x] explain `withFormField`
- [x] explain `formAware`
- [x] explain `withForm`
- [x] explain `withValidation`
- [x] explain `withError`
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
