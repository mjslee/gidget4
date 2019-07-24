import _ from 'lodash';
import Injector from './js-injector';


/*
 * Pre-ran step-by-step lookback.
 */
export default {
  // Steps
  steps: [],


  /**
   * Create a new stepper instance.
   * @return {object} Stepper instance.
   */
  create() {
    return _.cloneDeep(this);
  },


  /*
   * Reset properties.
   */
  reset() {
    this.steps = [];
    this.debugInput = undefined;
  },


  /*
   * Add to last step when entering/leaving scope from evaluated script.
   *
   * @param {number} ln - Line number.
   * @param {array} range - Array in the form of [fromNumber, toNumber]
   * @param {string} scope - Type of entered scope
   * @param {boolean} inside - Is inside scope. 'false' when leaving scope.
   */
  __scope__(ln, range, scope, inside) {
    const step = this.steps[this.steps.length - 1];
    if (step.ln == ln && step.range[0] == range[0] && step.range[1] == range[1])
      step.scope = { type: scope, inside };
    //else
    //  this.steps.push({ ln, range, scope: { type: scope, inside }});
  },


  /*
   * Add step from evaluated script.
   *
   * @param {number} ln - Line number.
   * @param {array} range - Array in the form of [fromNumber, toNumber]
   */
  __step__(ln, range) {
    this.steps.push({ index: this.steps.length, ln, range });

    if (typeof this.onStep === 'function')
      this.onStep.call();
  },


  /*
   * Collect data from evaluated script.
   *
   * @param {dictionary} Data to save.
   */
  __collect__(data) {
    const step = this.steps[this.steps.length - 1];
    const keys = Object.keys(data);

    // Proxy objects can break things like Vue, so we'll have to recreate
    // the object so there is no Proxy handler
    keys.forEach(key => {
      if (typeof data[key] === 'object')
        data[key] = Object.assign({}, data[key]);
    });

    // Set the step data
    step.data = data;
  },


  /*
   * Evaluate input.
   *
   * @param {string} ECMAScript code input.
   */
  run(input, imports={}) {
    this.reset();

    try {
      this.injector = Injector;
      this.debugInput = this.injector.run(input);
    }
    catch (e) {
      console.log('compiletime', e)
      return {
        hasError: true,
        error: {
          name: 'ParseError',
          ln: e.lineNumber,
          message: e.description
        }
      };
    }

    try {
      const fakeSandbox = () => {
        // Step functions
        const __scope__ = (...args) => this.__scope__(...args);
        const __step__ = (...args) => this.__step__(...args);
        const __collect__ = (...args) => this.__collect__(...args);
        const __imports__ = imports;

        // Override in this scope
        const window = undefined;
        const document = undefined;
        imports = undefined;

        // Suppress TS6133
        __scope__, __step__, __collect__, window, document;

        // Imports
        let importText = '';
        Object.keys(__imports__).forEach(key => {
          importText += `const ${key}=__imports__['${key}'];`;
        });

        // Evaluate modified user input
        eval(importText + this.debugInput);
      };

      fakeSandbox.call({});
    }
    catch (e) {
      console.debug(e);
      console.log('runtime', e)

      let ln = e.lineNumber;

      // Get line number from stacktrace
      if (typeof ln === 'undefined') {
        const match = e.stack.match(/:\d+:\d+\W$/m); // Match ':1:5', line is '1'
        if (match.length > 0)
          ln = parseInt(match[0].split(':')[1]);
      }

      return {
        hasError: true,
        error: {
          name: e.name,
          message: e.message || e.description,
          ln: ln
        }
      };
    }

    return { hasError: false, steps: this.steps };
  }
};
