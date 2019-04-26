import Injector from './js-injector';

/*
 * Pre-ran step-by-step lookback.
 */
export default {
  // Steps
  steps: [],
  index: 0,

  // Temporary Get/Set for spying
  tempCmd: undefined,


  /**
   * Create a new stepper instance.
   * @return {object} Stepper instance.
   */
  create() {
    return Object.create(this);
  },
   

  /*
   * Step after running.
   * @param {numnber} Offset index.
   * @return {dict} Step object.
   */
  next(offset=0) {
    const index = this.index + offset;
    // Index check
    if (index >= this.steps.length)
      return undefined;

    // Get step and if it has another step next
    const step = this.steps[index];
    step.hasNext = this.steps.length - 1 > index;
    step.hasError = false;

    return step;
  },

  /*
   * Step after running.
   * @return {dict} Step object.
   */
  async step() {
    const step = this.next();
    if (typeof step === 'undefined')
      return undefined;

    this.index += 1;

    const cmd = step.cmd;
    if (typeof cmd !== 'object')
      return step;

    // Object call
    if (typeof cmd.args !== 'undefined') {
      if (typeof cmd.obj[cmd.prop] === 'undefined') {
        step.hasError = true;
        step.error = {
          name: 'TypeError',
          message: `${cmd.prop} is not a function`,
          lineNumber: step.ln
        };
        return step;
      }

      const maybePromise = cmd.obj[cmd.prop].apply(cmd.obj, cmd.args);

      if (maybePromise && typeof maybePromise.then === 'function')
        await maybePromise.then();
    }

    // Assignment
    else if (typeof cmd.value !== 'undefined')
      cmd.obj[cmd.prop] = cmd.value;

    return step;
  },

  /*
   * Reset properties.
   */
  clean() {
    this.steps = [];
    this.index = 0;
    this.debugInput = undefined;
  },


  /*
   * Spy on object calls.
   * @param {object} Object to spy on.
   * @return {proxy} Proxy instance.
   */
  __spy__(obj) {
    if (typeof obj !== 'object')
      return obj;

    return new Proxy(obj, {
      get: (obj, prop) => {
        return (...args) => {
          this.tempCmd = { obj, prop, args };
        };
      },
      set: (obj, prop, value) => {
        this.tempCmd = { obj, prop, value };
        return true;
      },
    });
  },


  /*
   * Add to last step when entering/leaving scope from evaluated script.
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
   * @param {number} ln - Line number.
   * @param {array} range - Array in the form of [fromNumber, toNumber]
   */
  __step__(ln, range) {
    this.steps.push({ ln, range });
  },


  /*
   * Collect data from evaluated script.
   * @param {dictionary} Data to save.
   */
  __collect__(data) {
    const step = this.steps[this.steps.length - 1];
    step.data = data;

    if (typeof this.tempCmd === 'object') {
      step.cmd = this.tempCmd;
      this.tempCmd = undefined; // Unset temp for next step
    }
  },

   
  /*
   * Evaluate input.
   * @param {string} ECMAScript code input.
   */
  run(input, imports={}) {
    this.clean();

    try {
      this.injector = Injector;
      this.debugInput = this.injector.run(input);
    }
    catch (e) {
      return {
        hasError: true,
        error: {
          name: 'ParseError',
          lineNumber: e.lineNumber,
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
        const __spy__ = (...args) => this.__spy__(...args);
        const __imports__ = imports;

        // Override in this scope
        const window = undefined;
        const document = undefined;
        imports = undefined;

        // Suppress TS6133
        __scope__, __step__, __collect__, __spy__, window, document;

        // Imports
        let importText = '';
        Object.keys(__imports__).forEach(key => {
          importText += `const ${key}=__spy__(__imports__['${key}']);`;
        });

        // Evaluate modified user input
        eval(importText + this.debugInput);
      };

      fakeSandbox.call({});
    }
    catch (e) {
      let ln = e.lineNumber;

      // Get line number from stacktrace
      if (typeof ln === 'undefined') {
        const match = e.stack.match(/:\d+:\d+/);  // Match ':1:5', line is '1'
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

    return { hasError: false };
  }
};
