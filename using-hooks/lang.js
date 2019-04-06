/*
 * Pre-ran step-by-step lookback.
 */
const Stepper = {
  steps: [],
  index: 0,

  /*
   * Step after running.
   * @return {dict} Step information.
   */
  step() {
    if (this.index >= this.steps.length)
      return undefined;

    const step = this.steps[this.index++];
    const command = step.command;
    if (typeof command === 'object')
      command.target[command.prop].apply(this, command.args);

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
  spy(obj) {
    return new Proxy(obj, {
      get: (target, prop) => {
        return (...args) => {
          this.tempCommand = { target, prop, args };
        };
      }
    });
  },


  /*
   * Add step when entering/leaving scope from evaluated script.
   * @param {number} ln - Line number.
   * @param {array} range - Array in the form of [fromNumber, toNumber]
   * @param {string} scope - Type of entered scope
   * @param {boolean} inside - Is inside scope. 'false' when leaving scope.
   */
  __scope__(ln, range, scope, inside) {
    this.steps.push({ ln, range, scope: { type: scope, inside }});
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
    const step = this.steps[this.steps.length-1]
    step.data = data;

    if (typeof this.tempCommand === 'object') {
      step.command = this.tempCommand;
      this.tempCommand = undefined;
    }
  },

   
  /*
   * Evaluate input.
   * @param {string} ECMAScript code input.
   */
  run(input, imports) {
    this.clean();
    this.debugInput = Injector(input).run();

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

      // Imports
      let importText = '';
      Object.keys(__imports__).forEach(key => {
        importText += `const ${key}=this.spy(__imports__['${key}']);`;
      });

      // Evaluate modified user input
      eval(importText + this.debugInput);
    };

    fakeSandbox.call({});
  }
};



/*
 * Inject callbacks into user code.
 */
const Injector = (input) => {
  // Node types
  const blockNodes = ['WhileStatement', 'IfStatement', 'ForStatement'];
  const ignoreNodes = ['SwitchCase', 'BreakStatement'];

  // Parse input into AST and tokens
  const parseOptions = { loc: true, range: true };
  this.tree = esprima.parseScript(input, parseOptions);
  this.tokens = esprima.tokenize(input, parseOptions);


  /*
   * Traverse through AST.
   * @param {object} node - Tree node to traverse.
   * @param {function(node, prevNode)} callback - Callback to access bodies.
   */
  this.traverse = (node, callback) => {
    // Ignore non-object nodes
    if (node === null || typeof node !== 'object')
      return;

    const traverse = this.traverse;

    // Traverse down all nodes in node array
    if (Array.isArray(node))
      return node.forEach(subnode => {
        traverse(subnode, callback);
      });

    // Traverse down all property-keys of a node; non-object nodes will be
    // passed but quickly ignored in the next recurse
    Object.keys(node).forEach(key => {
      traverse(node[key], callback);
    });

    // Check for body and a valid callback
    if (typeof node.body === 'undefined' || typeof callback !== 'function')
      return;

    // Call the callback for each body in the body array
    if (Array.isArray(node.body))
      node.body.forEach(body => {
        callback(body, node);
      });

    // Call the callback
    else
      callback(node.body, node);
  };


  /*
   * Get all identifiers declared after an index.
   * @param {number} index - Index number to search after.
   * @return {string} String-dictionary.
   */
  this.getIdentifiersAfter = index => {
    let result = '';
    const identifiers = this.tokens.filter(t => t.type === 'Identifier');
    const names = [];

    identifiers.forEach(id => {
      // The node's range-end must be *after* the iterated identifier's
      // range-start
      if (id.range[0] > index)
        return;

      // Ignore duplicate identifier names
      const name = id.value;
      if (names.includes(name))
        return;
      else
        names.push(name);

      // Append identifier get key-pair 
      result += `'${name}':typeof ${name}!=='undefined'?${name}:undefined,`;
    });
    return '{' + result + '}';
  };


  /*
   * Get list of modifications to make to input string.
   * @return {array} Array of [['modification text', index]...]
   */
  this.getModifications = () => {
    const result = [];
    this.traverse([this.tree], (node, prevNode) => {
      // No modifications needed for these types of nodes
      if (ignoreNodes.includes(node.type))
        return;

      // Create scope function to generate a __scope__() call
      let scope;
      if (typeof prevNode !== 'undefined') {
        const ln = prevNode.loc.start.line;
        const range = prevNode.range.join();
        const type = prevNode.type;
        scope = inside => `;__scope__(${ln},[${range}],'${type}',${inside});`;
      }

      // Add scope step to BlockStatements
      if (node.type === 'BlockStatement') {
        result.push([ scope(true), node.range[0] + 1 ]);
        result.push([ scope(false), node.range[1] ]);
      }

      // Add scope to node that /could/ have a block statement
      else if (prevNode && blockNodes.includes(prevNode.type)) {
        result.push([ '{' + scope(true), node.range[0] ]);
        result.push([ scope(false) + '}', node.range[1] ]);
      }

      // Add step to any other node
      else {
        const ln = node.loc.start.line;
        const pairs = this.getIdentifiersAfter(node.range[1]);
        const range = '[' + node.range.join() + ']';
        result.push([`;__step__(${ln},${range});`, node.range[0]]);
        result.push([`;__collect__(${pairs});`, node.range[1]]);
      }
    });
    return result;
  };


  /*
   * Run text modifications on an input.
   * @return {string} Modified input.
   */
  this.run = () => {
    // Sort 
    const sortedMods = this.getModifications().sort((a, b) => b[1] - a[1]);

    sortedMods.forEach(mod => {
      // Insert (string)mod[0] at index of (int)mod[1]
      input = input.substring(0, mod[1]) + mod[0] + input.substring(mod[1]);
    });

    return input;
  };


  return this;
};
