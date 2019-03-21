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
