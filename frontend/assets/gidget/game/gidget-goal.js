import _ from 'lodash';
import { typeofLiteral } from './gidget-utility';

export const assertions = {
  // Equals
  equal  : 'equals',
  equals : {
    name   : 'equals',
    label  : 'Equals',
    symbol : '==',
    func   : (val1, val2) => _.isEqual(val1, val2),
  },

  // Greater Than
};

export const getAssertion = (assert) => {
  let assertion = assertions[assert];
  while (typeof assertion == 'string')
    assertion = assertions[assertion];
  return assertion;
};

export default class {
  constructor({ assert, args }) {
    this.assert = assert;
    this.args   = args;

    this.isComplete = undefined;
    this.isRemoved = false;
    return this;
  }

  reset() {
    this.isCompleted = undefined;
  }

  validate(data) {
    const assertion = getAssertion(this.assert);
    if (!assertion)
      return undefined;

    const values = this.args.map((arg) => {
      const { literal, type } = typeofLiteral(arg);
      return (type == 'identifier') ? _.get(data, literal) : literal;
    });

    this.isComplete = assertion.func(...values);
    return this.isComplete;
  }
}
