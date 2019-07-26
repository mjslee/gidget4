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

    if (typeof this.onStep == 'function')
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
      if (typeof data[key] == 'object')
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
      console.debug('compile time error', e)

      return {
        error: {
          ln: e.ln || e.lineNumber,
          name: 'ParseError',
          text: e.text || e.message || e.description
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

        // Suppress TS6133 linter message
        if (0) __scope__, __step__, __collect__, window, document

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
      console.debug('runtime error', typeof e, e)

      // Get line number of where the error was thrown
      let ln = e.ln || e.lineNumber
      if (typeof ln == 'undefined' && this.steps.length > 0)
        ln = this.steps[this.steps.length - 1].ln

      // Return error object
      return {
        steps: this.steps,
        error: {
          ln: ln,
          name: e.name,
          text: e.text || e.message || e.description
        }
      };
    }

    return { steps: this.steps };
  }
};
