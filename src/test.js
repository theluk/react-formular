import React from 'react'
import { provideFormular, withFormField } from './index'
import { create } from 'react-test-renderer'

const Input = withFormField((props) => <input onChange={(e) => props.update(e.target.value)} value={props.value} />)
const Form = provideFormular(({children, ...props}) => (
  <div {...props}>
    {children}
  </div>
))

test('formular basic functionality', () => {
  const onChange = jest.fn()

  const s = create(
    <Form initialData={{test: 'foo'}} onChange={onChange}>
      <Input field='test' />
    </Form>
  )

  const input = s.root.findByType('input')

  expect(input.props).toHaveProperty('value')
  expect(input.props.value).toEqual('foo')

  input.props.onChange({
    target: {
      value: 'bar'
    }
  })

  expect(input.props.value).toEqual('bar')
  expect(onChange.mock.calls[0][0]).toEqual({'test': 'bar'})
})

test('formular with nested functionality', () => {
  const onChange = jest.fn()

  const s = create(
    <Form onChange={onChange} initialData={{
      one: 'hello world',
      foo: {bar: 'value'}
    }}>
      <Input field='one' />
      <Form field='foo'>
        <Input field='bar' />
      </Form>
    </Form>
  )

  const firstInput = s.root.findAllByType('input', {deep: false})

  expect(firstInput[0].props.value).toEqual('hello world')

  const innerForm = s.root.findAllByType(Form)[1]

  const innerInput = innerForm.findByType('input')

  expect(innerInput.props.value).toEqual('value')

  innerInput.props.onChange({target: {value: 'bar'}})

  expect(onChange.mock.calls[0][0], {
    one: 'hello world',
    foo: {bar: 'bar'}
  })
})

beforeEach(() => {
  jest.spyOn(console, 'error')
  global.console.error.mockImplementation(() => {})
})

afterEach(() => {
  global.console.error.mockRestore()
})

test('formular with nested functionality expects field', () => {
  expect(() => {
    create(
      <Form>
        <Form />
      </Form>
    )
  }).toThrowError(/Nested form/)
})
