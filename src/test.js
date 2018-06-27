import React from 'react'
import { provideFormular, withFormField, Middleware } from './index'
import { create } from 'react-test-renderer'

const Input = withFormField(e => e.target.value)('input')
const Form = provideFormular()

test('provideFormular', () => {
  const Form = provideFormular()
  const s = create(<Form />)
  expect(s.toJSON().type).toBe('form')

  const DivForm = provideFormular('div')
  const d = create(<DivForm />)
  expect(d.toJSON().type).toBe('div')
})

test('withFormField', () => {
  const rendered = create(<Form initialData={{}}><Input field="value" type="text" /></Form>)
  rendered.root.findByType('input').props.onChange({target: {value: 'foo'}})
})

test('basic middleware', () => {
  const onChange = jest.fn()

  const s = create(
    <Form initialData={{test: 'foo'}} onChange={onChange}>
      <Middleware use={(data, update, fail) => (
        data.test === 'two' ? update(data) : fail({test: 'Test must be two'})
      )}>
        <Input field='test' />
      </Middleware>
    </Form>
  )

  const input = s.root.findByType('input')
  expect(input.props.value).toEqual('foo')

  input.props.onChange({
    target: {
      value: 'something'
    }
  })

  expect(onChange.mock.calls.length).toBe(0)

  input.props.onChange({
    target: {
      value: 'two'
    }
  })

  expect(onChange.mock.calls.length).toBe(1)

})

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

  expect(onChange.mock.calls[0][0]).toEqual({'test': 'bar'})
  expect(input.props.value).toEqual('bar')
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
