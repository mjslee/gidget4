import GidgetWorld from '@/assets/gidget/game/gidget-world'
import GidgetObject from '@/assets/gidget/game/gidget-object'



test('create game object', () => {
  const obj = GidgetObject.create({ type: 'Gidget' })
  expect(obj.name).toBe('Gidget')
})


test('create game object with attributes', () => {
  const obj = GidgetObject.create({ type: 'Test', test: true })
  expect(obj.test).toBe(true)
  expect(obj.exposed.testOverride()).toBe(0)
})


test('create game object with invalid attributes', () => {
  const obj = GidgetObject.create()
  expect(obj).toBe(undefined)
})


test('create game object with mixin', () => {
  const obj = GidgetObject.create({ type: 'Test', mixins: ['Test1'] })
  expect(obj.isObject).toBe(true)
  expect(obj.isFirstMixin).toBe(1)
  expect(obj.exposed.testOverride()).toBe(1)
})


test('create game object with invalid mixin', () => {
  const obj = GidgetObject.create({ type: 'Test', mixins: ['InvalidMixin'] })
  expect(typeof obj).toBe('object')
})


test('create game object with multiple mixins', () => {
  // Test2 mixin overrides Test1
  const obj1 = GidgetObject.create({ type: 'Test', mixins: ['Test1', 'Test2'] })
  expect(obj1.isObject).toBe(true)
  expect(obj1.isFirstMixin).toBe(1)
  expect(obj1.isSecondMixin).toBe(2)
  expect(obj1.exposed.testProp).toBe('2')
  expect(obj1.exposed.firstMixin()).toBe(1)
  expect(obj1.exposed.secondMixin()).toBe(2)
  expect(obj1.exposed.testOverride()).toBe(2)

  // Test1 mixin overrides Test2
  const obj2 = GidgetObject.create({ type: 'Test', mixins: ['Test2', 'Test1'] })
  expect(obj2.isObject).toBe(true)
  expect(obj2.isFirstMixin).toBe(1)
  expect(obj2.isSecondMixin).toBe(2)
  expect(obj2.exposed.testProp).toBe('1')
  expect(obj2.exposed.firstMixin()).toBe(1)
  expect(obj2.exposed.secondMixin()).toBe(2)
  expect(obj2.exposed.testOverride()).toBe(1)
})


test('update game object exposed getter properties', () => {
  const obj = GidgetObject.create({ type: 'Test', mixins: ['Test1'] })
  obj.exposed['get testProp'] = () => 1000
  obj.updateProps()

  expect(obj.exposed.testProp).toBe(1000)
})
