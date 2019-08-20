import GidgetWorld from '@/assets/gidget/game/gidget-world'
import GidgetObject from '@/assets/gidget/game/gidget-object'



describe('create game object', () => {
  const obj = GidgetObject.create({ type: 'Gidget' })
  expect(obj.name).toBe('Gidget')

  test('with attributes', () => {
    const obj = GidgetObject.create({
      type: 'Test', test: true, position: { x: 2, y: 2 }
    })
    expect(obj.position.x).toBe(2)
    expect(obj.position.y).toBe(2)
    expect(obj.test).toBe(true)
    expect(obj.exposed.testOverride()).toBe(0)
  })


  test('with invalid attributes', () => {
    const obj = GidgetObject.create()
    expect(obj).toBe(undefined)
  })

  test('with mixin', () => {
    const obj = GidgetObject.create({ type: 'Test', mixins: ['Test1'] })
    expect(obj.isObject).toBe(true)
    expect(obj.isFirstMixin).toBe(1)
    expect(obj.exposed.testOverride()).toBe(1)
  })

  test('with invalid mixin', () => {
    const obj = GidgetObject.create({ type: 'Test', mixins: ['InvalidMixin'] })
    expect(typeof obj).toBe('object')
  })

  test('with multiple mixins', () => {
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
})



test('update game object exposed getter properties', () => {
  const obj = GidgetObject.create({ type: 'Test', mixins: ['Test1'] })
  obj.exposed['get testProp'] = () => 1000
  obj.updateProps()

  expect(obj.exposed.testProp).toBe(1000)
})



describe('get game object', () => {
  const world = GidgetWorld.create()
  const gidget = GidgetObject.create({ type: 'Gidget' })
  world.addObject(gidget)
  world.addObject(GidgetObject.create({ type: 'Test' }))
  world.addObject(GidgetObject.create({ type: 'Test' }))

  test('by object', () => {
    const obj = world.getObject(gidget)
    expect(typeof obj).toBe('object')
    expect(obj.name).toBe('Gidget')
  })
  test('by string', () => {
    const obj = world.getObject('Gidget')
    expect(typeof obj).toBe('object')
    expect(obj.name).toBe('Gidget')
  })
  // test('by function')
})



describe('move game object', () => {
  test('move game object', () => {
    const world = GidgetWorld.create()
    const obj = GidgetObject.create({ type: 'Gidget' })
    world.addObject(obj)
    const moved = obj.move({ x: 1, y: 1 })

    expect(obj.position.x).toBe(1)
    expect(obj.position.y).toBe(1)
    expect(moved).toBe(true)
  })


  test('move game object without world', () => {
    const obj = GidgetObject.create({ type: 'Gidget' })
    const moved = obj.move({ x: 1, y: 1 })

    expect(obj.position.x).toBe(0)
    expect(obj.position.y).toBe(0)
    expect(moved).toBe(false)
  })
})



describe('grab game object', () => {
  const init = () => {
    const world = GidgetWorld.create()
    const gidget = GidgetObject.create({ type: 'Gidget' })
    const object = GidgetObject.create({ type: 'Test' })
    world.addObject(gidget)
    world.addObject(object)
    return [gidget, object]
  }

  test('object is assigned grabber', () => {
    const [gidget, object] = init()
    const grabbed = gidget.grab(object)
    expect(grabbed).toBe(true)
    expect(object.grabber).toBe(gidget.id)
  })
  test('callbacks are called', () => {
    const [gidget, object] = init()
    let onGrabCalled = false
    let onGrabbedCalled = false
    gidget.onGrab = () => onGrabCalled = true
    object.onGrabbed = () => onGrabbedCalled = true

    gidget.grab(object)
    expect(onGrabCalled).toBe(true)
    expect(onGrabbedCalled).toBe(true)
  })
  test('doesnt grab already grabbed object', () => {
    const [gidget, object] = init()
    /* first grab */   gidget.grab(object)
    const secondGrab = gidget.grab(object)
    expect(secondGrab).toBe(false)
  })
  test('doesnt grab game object in wrong position', () => {
    const [gidget, object] = init()
    // Move object to be at a different position
    const moved = gidget.move({ x: 1, y: 1 }) 
    const grabbed = gidget.grab(object)
    expect(grabbed).toBe(false)
    expect(object.grabber).toBe(undefined)
  })
  test('doesnt grab non-existant object', () => {
    const [gidget, object] = init()
    const grabbed = gidget.grab('NonExistantObject')
    expect(grabbed).toBe(false)
    expect(object.grabber).toBe(undefined)
  })
})



describe('drop game object', () => {
  // Initialize game world and objects
  const world = GidgetWorld.create()
  const gidget = GidgetObject.create({ type: 'Gidget' })
  const object = GidgetObject.create({ type: 'Test' })

  // Add objects to world
  world.addObject(gidget)
  world.addObject(object)

  // Grab the game object
  const grabbed = gidget.grab(object)
  expect(grabbed).toBe(true)
  expect(object.grabber).toBe(gidget.id)

  // Move game object
  const moved = gidget.move({ x: 1, y: 1 }) 
  expect(moved).toBe(true)

  // Drop the game object
  const dropped = gidget.drop(object)
  expect(dropped).toBe(true)

  // Ensure dropped object's position is updated
  expect(object.position.x).toBe(1)
  expect(object.position.y).toBe(1)
})
