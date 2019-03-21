import GidgetWorld from '../../src/assets/game/gidget-world';
import GidgetObject from '../../src/assets/game/gidget-object';


test('creates a world instance', () => {
  const world = GidgetWorld.create();

  expect(world).toBeDefined();
});


test('creates a world instance with kwargs', () => {
  const world = GidgetWorld.create({ size: 10 });

  expect(world.size).toBe(10);
});

test('creates an object', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject();

  expect(obj).toBeDefined();
});


test('creates an object with kwargs', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject({ name: 'Custom Name' });

  expect(obj).toBeDefined();
  expect(obj.name).toBe('Custom Name');
});


test('creates an object with type', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject({ name: 'Custom Name' });

  expect(obj).toBeDefined();
  expect(obj.name).toBe('Custom Name');
});
