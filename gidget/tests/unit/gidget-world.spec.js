
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
  expect(world.removeObject(obj.id)).toBe(true);
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


test('moves an object', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject();

  expect(obj.position.x).toBe(0);
  expect(obj.position.y).toBe(0);
  world.moveObject(obj, 1, 2)
  expect(obj.position.x).toBe(1);
  expect(obj.position.y).toBe(2);
});


test('onObjectMoved is fired after moving an object', () => {
  const world = GidgetWorld.create();
  let fired = false;
  world.onObjectMoved = () => fired = true;
  const obj = world.createObject();
  world.moveObject(obj, 1, 2)

  expect(fired).toBe(true);
});


test('position 1,1 is valid', () => {
  const world = GidgetWorld.create();
  const isPositionValid = world.isPositionValid(1, 1);

  expect(isPositionValid).toBe(true);
});


test('position 5,1 is not valid because it is out of bounds', () => {
  const world = GidgetWorld.create();
  const isPositionValid = world.isPositionValid(5, 1);

  expect(isPositionValid).toBe(false);
});


test('position 1,5 is not valid because it is out of bounds', () => {
  const world = GidgetWorld.create();
  const isPositionValid = world.isPositionValid(1, 5);

  expect(isPositionValid).toBe(false);
});


test('position 2,1 is not valid because of a blocking object', () => {
  const world = GidgetWorld.create();
  world.createObject({ blocking: true, position: { x: 2, y: 1 } })
  const isPositionValid = world.isPositionValid(2, 1);

  expect(isPositionValid).toBe(false);
});


test('onCollision is fired by causing object', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject({ position: { x: 0, y: 0 } });
  world.createObject({ position: { x: 1, y: 1 } });

  let fired = false;
  obj.onCollision = () => fired = true;

  world.moveObject(obj, 1, 1);
  expect(fired).toBe(true);
});


test('onCollision is fired by non-causing object', () => {
  const world = GidgetWorld.create();
  const obj1 = world.createObject({ position: { x: 0, y: 0 } });
  const obj2 = world.createObject({ position: { x: 1, y: 1 } });

  let fired = false;
  obj2.onCollision = () => fired = true;

  world.moveObject(obj1, 1, 1);
  expect(fired).toBe(true);
});


test('gets an objects boundaries with 1x scale', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject({
    position: { x: 0, y: 0 },
    scale: 1
  });
  const bounds = world.getObjectBoundaries(obj);

  expect(bounds.fromX).toBe(0);
  expect(bounds.fromY).toBe(0);
  expect(bounds.toX).toBe(0);
  expect(bounds.toY).toBe(0);
});


test('gets an objects boundaries with 2x scale', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject({
    position: { x: 1, y: 1 },
    scale: 2
  });
  const bounds = world.getObjectBoundaries(obj);

  expect(bounds.fromX).toBe(1);
  expect(bounds.fromY).toBe(0);
  expect(bounds.toX).toBe(1);
  expect(bounds.toY).toBe(1);
});


test('gets an objects boundaries with 3x scale', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject({
    position: { x: 2, y: 2 },
    scale: 3
  });
  const bounds = world.getObjectBoundaries(obj);

  expect(bounds.fromX).toBe(1);
  expect(bounds.fromY).toBe(0);
  expect(bounds.toX).toBe(3);
  expect(bounds.toY).toBe(2);
});


test('point is inside an objects boundaries with 1x scale', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject({
    position: { x: 1, y: 1 },
    scale: 1
  });
   
  expect(world.insideObjectBoundaries(obj, 1, 1)).toBe(true);
});

 
test('point is not inside an objects boundaries with 1x scale', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject({
    position: { x: 1, y: 1 },
    scale: 1
  });
   
  expect(world.insideObjectBoundaries(obj, 0, 1)).toBe(false);
  expect(world.insideObjectBoundaries(obj, 1, 0)).toBe(false);
});


test('point is inside an objects boundaries with 2x scale', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject({
    position: { x: 1, y: 1 },
    scale: 2,
    scaleBoundaries: true
  });
   
  expect(world.insideObjectBoundaries(obj, 1, 1)).toBe(true);
  expect(world.insideObjectBoundaries(obj, 1, 0)).toBe(true);
});


test('point is not inside an objects boundaries with 2x scale', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject({
    position: { x: 1, y: 1 },
    scale: 2,
    scaleBoundaries: true
  });
   
  expect(world.insideObjectBoundaries(obj, 0, 0)).toBe(false);
  expect(world.insideObjectBoundaries(obj, 0, 1)).toBe(false);
  expect(world.insideObjectBoundaries(obj, 2, 0)).toBe(false);
  expect(world.insideObjectBoundaries(obj, 2, 1)).toBe(false);
});


test('point is inside an objects boundaries with 3x scale', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject({
    position: { x: 2, y: 2 },
    scale: 3,
    scaleBoundaries: true
  });
   
  expect(world.insideObjectBoundaries(obj, 1, 0)).toBe(true);
  expect(world.insideObjectBoundaries(obj, 2, 1)).toBe(true);
  expect(world.insideObjectBoundaries(obj, 3, 2)).toBe(true);
});


test('point is not inside an objects boundaries with 3x scale', () => {
  const world = GidgetWorld.create();
  const obj = world.createObject({
    position: { x: 3, y: 3 },
    scale: 3,
    scaleBoundaries: true
  });
   
  expect(world.insideObjectBoundaries(obj, -1, -1)).toBe(false);
  expect(world.insideObjectBoundaries(obj, 4, 0)).toBe(false);
});
