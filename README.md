# react-formular

[![NPM](https://img.shields.io/npm/v/react-formular.svg)](https://www.npmjs.com/package/react-formular) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This libraray is an experimental approach to bind forms and its inputs and editors together using the new React Context API. It aims to be fully customizable and composable. It´s only a set of Higher-Order-Components.

> **ATTENTION** this is not an ui library, it is just a set of tools to bind forms and its inputs together. 

> **ATTENTION** I need help with this project, so let me know if you want to help


## Focus / Motivation / Features

- Uses React Context API (requires 16.3)
- Minimalistic approach
- Does not tell you how to design
- Helps you with data flow only
- Decouple form, validation and inputs completely from each other
- Built as composable Higher-Order-Components
- Focus on pure & stateless components
- Support nesting
- Support unopinionated validation

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

# `provideFormular(Component)`

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

# `withFormField(WrappedComponent)`

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

# `formAware(func, displayName)`

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

# `withForm(Component)`

A convenient function that uses `formAware`. It in constrast supports non-functional components.

```jsx
  const ResetButton = withForm(({ update, ...props }) => (
    return (<Button {...props} onClick={ update({}) }>Reset</Button>)
  ))
```

# `withValidation(Component)`

returns a HOC that can be placed anywhere within the form. It then acts like a guard or a middleware. It calls the passed in `onValidate` callback that has the same signature as the `update` method. Actually it just overrides the `update` method with its own logic, and only when validation passes, it will call the `update`. As the `withValidation` function is using `withForm`, the correct `update` function is injected automatically. 

`onValidate` should return an array so that it could be desctructed as follows
    
    const [isValid, errors] = onValidate();

#### Example

define a component which can handle validation. Actually enhancing `Component` is already everything you need to do.

```jsx
const Validator = withValidation(Component)
```

define your validations. Use any libraray you like for that. 

> **NOTE** the API of the return statement is WIP

```jsx
const onValidate = (field, value) => {
  if (field === "hello") {
    return [true, null]
  } else {
    return [false, {field: 'Only `hello` can be edited'}]
  }
}
const onChange = (newData) => { console.log(newData) }
```

the `onChange` method will only be called when the `Validator` passes the changed data through.
```jsx
render(
  <Form initialData={data} onChange={onChange}>
    <Validator onValidate={onValidate}>
      <Input field="hello" type="text" />
      <Input field="world" type="text" />
    </Validator>
  </Form>
)
```

#### Validation on fields directly

because of the nature of composing, you can actually build yourself a HOC that can validate single inputs where you define your validation directly.

```jsx
const withRegexValidatorForField = InputComponent => ({regex, field, ...props}) => {
  // simple regex valdation method
  const onValidate = (field, value) => regex.test(value) ? [true, null] : [false, 'Error'];
  return (
    <Validator onValidate={onValidate}>
      <InputComponent field={field} {...props} />
    </Validator>
  )
}

const RegexInput = withRegexValidatorForField(Input)
```

```jsx
render(
  <Form initialData={data} onChange={onChange}>
    <RegexInput field="hello" type="text" regex={ /world/ } />
  </Form>
)
```

# `withError(Component)`

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
