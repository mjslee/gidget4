import _ from 'lodash';

const assertions = {
  equal: (arg1, arg2) => _.isEqual(arg1, arg2),
};

export default class {
  constructor({ assertion, args }) {
    this.assertion = assertion;
    this.arguments = args;
    return this;
  }

  validate() {

  }
}
