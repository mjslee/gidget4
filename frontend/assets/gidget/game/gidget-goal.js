export default {
  world: undefined,
  objects: undefined,


  create(world, data) {
    const result = Object.create(this);
    result.world = world;
    result.data = data;
    return result;
  },


  validate(goal) {
    this.objects = this.world.getObjectsGrouped();

    switch (goal.assert) {
      case 'equal':
        return this.assertEquals(
          JSON.stringify(this.getValue(goal.arguments[0])),
          JSON.stringify(this.getValue(goal.arguments[1]))
        );

      case 'notEqual':
        break;

      case 'greaterThan':
        break;

      case 'lessThan':
        break;

      case 'exists':
        break;
    }
  },


  getValue(value) {
    const lastIndex = value.length - 1;
    if (value[0] === '\'' && value[lastIndex] === '\'')
      return value.substring(1, lastIndex);

    let a, b;
    try { b = eval(`this.data.${value}`); } catch (e) { }
    try { a = eval(`this.objects.${value}`); } catch (e) { }

    return a || b || value;
  },


  assertEquals(a, b) {
    return a === b;
  },
}
