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
