import _ from 'lodash';

export const assertions = {
  equals: {
    name:   'equals',
    label:  'Equals',
    symbol: '==',
    func:   (arg1, arg2) => _.isEqual(arg1, arg2),
  }
};

export default class {
  constructor({ assert, args }) {
    this.assert = assert;
    this.args = args;
    return this;
  }

  validate() {

  }
}
