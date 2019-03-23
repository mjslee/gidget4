import GidgetWorld from '../../src/assets/game/gidget-world';
import GidgetObject from '../../src/assets/game/gidget-object';


test('object is created', () => {
  const obj = Object.assign({}, GidgetObject);
  obj.name = 'Name';
  obj.type = 'Type';
  obj.create(0);

  expect(obj).toBeDefined();
  expect(obj.id).toBe(0);
  expect(obj.name).toBe('Name');
  expect(obj.type).toBe('Type');
});


test('object is created without name', () => {
  const obj = Object.assign({}, GidgetObject);
  obj.type = 'Type';
  obj.create(0);

  expect(obj).toBeDefined();
  expect(obj.id).toBe(0);
  expect(obj.name).toBe('Type');
  expect(obj.type).toBe('Type');
});


test('onCreate is fired after after creation', () => {
  let fired = false;
  const obj = Object.assign({}, GidgetObject);
  obj.type = 'Type';
  obj.onCreate = () => fired = true;
  obj.create(0);

  expect(fired).toBe(true);
});


test('object is moved', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject();

  expect(obj.move(2, 2)).toBe(true);
  expect(obj.position.x).toBe(2);
  expect(obj.position.y).toBe(2);
});


test('object is not moved when out of bounds', () => {
  const world = GidgetWorld.create({ size: 3 });
  const obj = world.createObject();

  expect(obj.move(10, 10)).toBe(false);
  expect(obj.position.x).not.toBe(10);
  expect(obj.position.y).not.toBe(10);
});


test('object grabs another object by its ID', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject();
  const grabbedObj = world.createObject();

  expect(world.objects.length).toBe(2);
  expect(obj.grab(grabbedObj.id)).toBe(true);
  expect(world.objects.length).toBe(1);
  expect(obj.grabbed.length).toBe(1);
});


test('object drops another object', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject();
  const grabbedObj = world.createObject();

  // grab the object
  expect(obj.grab(grabbedObj.id)).toBe(true);
  expect(world.objects.length).toBe(1);
  expect(obj.grabbed.length).toBe(1);

  // drop the object
  expect(obj.drop(grabbedObj.id)).toBe(true);
  expect(world.objects.length).toBe(2);
  expect(obj.grabbed.length).toBe(0);
});


test('object drops itself', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject();
  const grabbedObj = world.createObject();

  // Grab grabbedObj
  expect(obj.grab(grabbedObj.id)).toBe(true);
  expect(world.objects.length).toBe(1);

  // grabbedObj drops itself
  expect(obj.grabbed.length).toBe(1);
  expect(grabbedObj.drop()).toBe(true);
  expect(obj.grabbed.length).toBe(0);
  expect(world.objects.length).toBe(2);
});


test('object is removed', () => {
  const world = GidgetWorld.create({ size: 3 });
  const obj = world.createObject();

  expect(world.objects.length).toBe(1);
  expect(obj.remove()).toBe(true);
  expect(world.objects.length).toBe(0);
});


test('object is not removed when grabbed', () => {
  const world = GidgetWorld.create({ size: 3 });
  const obj = world.createObject();
  const grabbedObj = world.createObject();
  obj.grab(grabbedObj.id);

  expect(world.objects.length).toBe(1);
  expect(grabbedObj.remove()).toBe(false);
  expect(obj.grabbed.length).toBe(1);
  expect(world.objects.length).toBe(1);
});
