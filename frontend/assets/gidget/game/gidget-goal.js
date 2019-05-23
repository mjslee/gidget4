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


  getValue(symbol) {
    const lastIndex = symbol.length - 1;
    if (symbol[0] === '\'' && symbol[lastIndex] === '\'')
      return symbol.substring(1, lastIndex);

    let a, b;
    try { a = eval(`this.objects.${symbol}`) } catch (e) { }
    try { b = eval(`this.data.${symbol}`) } catch (e) { }
    return a || b || symbol;
  },


  assertEquals(a, b) {
    return a === b;
  },
}
