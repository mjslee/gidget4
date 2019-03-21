
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


test('creates a player', () => {
  const world = GidgetWorld.create();
  const obj = world.createPlayer({});

  expect(obj).toBeDefined();
  expect(world.player.id).toBe(obj.id);
});


test('onObjectAdded is fired when object is added', () => {
  const world = GidgetWorld.create();
  let fired = false;
  world.onObjectAdded = () => fired = true;

  const obj = Object.assign({}, GidgetObject);
  obj.name = 'Test Object';

  expect(world.objects.length).toBe(0);
  world.addObject(obj);

  expect(world.objects.length).toBe(1);
  expect(fired).toBe(true);
});


test('nextID is incremented', () => {
  const world = GidgetWorld.create();
  expect(world.nextID).toBe(-1);
  world.createObject();
  expect(world.nextID).toBe(0);
});


test('gets an object', () => {
  const world = GidgetWorld.create();
  const objName = 'Test Object';
  world.createObject({ name: objName });

  const obj = world.getObject(obj => obj.name == objName);
  expect(obj.name).toBe(objName);
});

test('does not get a non-existant object', () => {
  const world = GidgetWorld.create();
  const objName = 'Test Object';
  world.createObject({ name: 'Correct Name' });

  const obj = world.getObject(obj => obj.name == objName);
  expect(obj).toBeUndefined();
});


test('gets an object at x:1,y:0 and does not at x:2,y:0', () => {
  const world = GidgetWorld.create();
  world.createObject({ position: { x: 1, y: 0 } });
  const obj = world.getObjectAt(1, 0);

  expect(obj).toBeDefined();
});


test('does not get an object at x:2,y:0', () => {
  const world = GidgetWorld.create();
  world.createObject({ position: { x: 1, y: 0 } });
  const obj = world.getObjectAt(2, 0);

  expect(obj).toBeUndefined();
});


test('removes an object', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject();

  expect(world.objects.length).toBe(1);
  world.removeObject(obj.id);
  expect(world.objects.length).toBe(0);
});


test('does not remove a non-existant object', () => {
  const world = GidgetWorld.create();
  world.createObject();

  expect(world.objects.length).toBe(1);
  expect(world.removeObject(999)).toBe(false);
  expect(world.objects.length).toBe(1);
});


test('onObjectRemoved is fired on object removal', () => {
  const world = GidgetWorld.create();
  let fired = false;
  world.onObjectRemoved = () => fired = true;
  const obj = world.createObject();

  expect(world.removeObject(obj.id)).toBe(true);
  expect(fired).toBe(true);
});
