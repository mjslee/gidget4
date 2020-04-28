import _ from 'lodash';
import { typeofLiteral } from './gidget-utility';

export const assertions = {
  // Equals
  equals : {
    name   : 'equals',
    label  : 'Equals',
    symbol : '==',
    func   : (val1, val2) => _.isEqual(val1, val2),
  },

  // Greater Than
};

/**
 * [TODO:description]
 *
 * @function getAssertion
 * @param {[TODO:type]} assert - [TODO:description]
 * @return {[TODO:type]} [TODO:description]
 */
export const getAssertion = (assert) => {
  return assertions[assert];
};

export default class {
  /**
   *
   */
  constructor({ assert, args, complete=undefined, incomplete=undefined }) {
    Object.assign(this, { assert, args, complete, incomplete });

    this.isComplete = undefined;
    this.isRemoved  = false;
    return this;
  }

  /**
   *
   */
  reset() {
    this.isCompleted = undefined;
  }

  /**
   *
   */
  validate(data) {
    const assertion = getAssertion(this.assert);
    if (!assertion)
      return undefined;

    const values = this.args.map((arg) => {
      const { literal, type } = typeofLiteral(arg);
      return (type == 'identifier') ? _.get(data, literal) : literal;
    });

    this.isComplete = assertion.func(...values);
    return { values, ...this };
  }
}
