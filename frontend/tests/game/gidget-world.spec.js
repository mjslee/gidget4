import GidgetWorld from '@/assets/gidget/game/gidget-world'
import GidgetObject from '@/assets/gidget/game/gidget-object'



test('create game world', () => {
  const world = GidgetWorld.create()

  expect(world.size).toBe(3)
  expect(world.objects.length).toBe(0)
  expect(world.messages.length).toBe(0)
})


test('create game world with attributes', () => {
  const world = GidgetWorld.create({ size: 10, test: true })

  expect(world.size).toBe(10)
  expect(world.test).toBe(true)
})


test('add new game object', () => {
  const world = GidgetWorld.create()
  const obj = GidgetObject.create({ type: 'Gidget' })

  world.addObject(obj)

  expect(world.objects.length).toBe(1)
})
