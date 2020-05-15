import Injector from './js-injector';


export default class JsStepper {

  /**
   * Create a new stepper instance.
   *
   * @return {void}
   */
  constructor({ onStep, maxSteps }) {
    this.steps = [];
    this.maxSteps = maxSteps || 100;
    this.onStep = onStep;
  }


  /*
   * Reset properties.
   */
  reset() {
    this.steps = []
    this.debugInput = undefined
  }


  /*
   * Add to last step when entering/leaving scope from evaluated script.
   *
   * @param {number} ln - Line number.
   * @param {array} range - Array in the form of [fromNumber, toNumber]
   * @param {string} scope - Type of entered scope
   * @param {boolean} inside - Is inside scope. 'false' when leaving scope.
   */
  __scope__(ln, range, scope, inside) {
    // Get final step
    const step = this.steps[this.steps.length - 1];
    if (
      typeof step == 'object' && typeof step.range == 'object' &&
      step.ln == ln && step.range[0] == range[0] && step.range[1] == range[1]
    )
      step.scope = { type: scope, inside };

    //else
    //  this.steps.push({ ln, range, scope: { type: scope, inside }});
  }


  /*
   * Add step from evaluated script.
   *
   * @param {number} ln - Line number.
   * @param {array} range - Array in the form of [fromNumber, toNumber]
   */
  __step__(ln, range) {
    // Limit amount of steps to prevent infinite loops and exhaust resources
    if (this.steps.length >= this.maxSteps)
      throw {
        error: {
          ln: ln,
          type: 'MaxStepsExceeded',
          text: 'Maximum number of steps exceeded.'
        }
      }

    this.steps.push({ index: this.steps.length, ln, range });

    if (typeof this.onStep == 'function')
      this.onStep.call();
  }


  /*
   * Collect data from evaluated script.
   *
   * @param {dictionary} Data to save.
   */
  __collect__(data) {
    // Get final step
    const step = this.steps[this.steps.length - 1];
    if (typeof step == 'undefined')
      return

    const keys = Object.keys(data);

    // Proxy objects can break things like Vue, so we'll have to recreate
    // the object so there is no Proxy handler
    keys.forEach(key => {
      if (typeof data[key] == 'object')
        data[key] = Object.assign({}, data[key]);
    });

    // Set the step data
    step.data = data;
  }


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
      }
    }

    try {
      const fakeSandbox = () => {
        // Step functions
        const __scope__   = (...args) => this.__scope__(...args);
        const __step__    = (...args) => this.__step__(...args);
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
