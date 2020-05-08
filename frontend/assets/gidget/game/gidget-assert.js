import _ from 'lodash';
import { typeofLiteral } from './gidget-utility';

export const assertions = {
  equal: {
    name:   'equal',
    label:  'Equal',
    symbol: '==',
    func:   (val1, val2) => _.isEqual(val1, val2),
  },

  notEqual: {
    name:   'notEqual',
    label:  'Not Equal',
    symbol: '!=',
    func:   (val1, val2) => !_.isEqual(val1, val2),
  },

  greaterThan: {
    name:   'greaterThan',
    label:  'Greater Than',
    symbol: '>',
    func:   (val1, val2) => val1 > val2,
  },

  greaterThanOrEqual: {
    name:   'greaterThanOrEqual',
    label:  'Greater Than or Equal',
    symbol: '<=',
    func:   (val1, val2) => val1 >= val2,
  },

  lessThan: {
    name:   'lessThan',
    label:  'Less Than',
    symbol: '<',
    func:   (val1, val2) => val1 < val2,
  },

  lessThanOrEqual: {
    name:   'lessThanOrEqual',
    label:  'Less Than or Equal',
    symbol: '<=',
    func:   (val1, val2) => val1 <= val2,
  },
};


export default class GidgetAssert {
  /**
   * GidgetAssert constructor.
   */
  constructor({ assert, args, complete=undefined, incomplete=undefined }) {
    Object.assign(this, { assert, args, complete, incomplete });

    this.isComplete = undefined;
    this.isRemoved  = false;
    return this;
  }

  /**
   * Reset the assertion by setting completion flag to undefined.
   *
   * @return {void}
   */
  reset() {
    this.isComplete = undefined;
  }

  /**
   * Validate the assertion and set its completion flag.
   *
   * @param {object} data - Exposed data to validate identifiers from.
   * @return {object} 
   */
  validate(data) {
    const assertion = assertions[this.assert];
    if (!assertion)
      return undefined;

    const values = this.args.map((arg) => {
      const { literal, type } = typeofLiteral(arg);
      return (type == 'identifier')
        ? _.get(data, literal)
        : literal;
    });

    this.isComplete = assertion.func(...values);
    return { values, ...this };
  }
}
