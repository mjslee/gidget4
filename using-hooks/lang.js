const Stepper = {
  steps: [],
  index: 0,

  /*
   *
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
   *
   */
  clean() {
    this.steps = [];
    this.index = 0;
    this.debugInput = undefined;
  },


  /*
   *
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
   *
   */
  __step__(ln, range, data) {
    this.steps.push({ ln, range, data, command: this.tempCommand });
    this.tempCommand = undefined;
  },


  /*
   *
   */
  __scope__(ln, range) {
    this.steps.push({ ln, range });
  },

   
  /*
   *
   */
  run(input) {
    this.clean();

    this.debugInput = Injector(input);

    const fakeSandbox = () => {
      const window = undefined;
      const document = undefined;
      const print = this.spy(console);

      const __scope__ = (...args) => this.__scope__(...args);
      const __step__ = (...args) => this.__step__(...args);

      eval(this.debugInput);
    };

    fakeSandbox.call({});
  }
};



/*
 *
 */
const Injector = (input) => {
  //
  const blockNodes = ['WhileStatement', 'IfStatement', 'ForStatement'];
  const ignoreNodes = ['SwitchCase', 'BreakStatement'];

  //
  const parseOptions = { loc: true, range: true };
  this.tree = esprima.parseScript(input, parseOptions);
  this.tokens = esprima.tokenize(input, parseOptions);

   
  /*
   *
   */
  this.traverse = (node, callback, parentNode=undefined) => {
    // Ignore node when non-existant
    if (node === undefined || node === null)
      return;

    // Traverse down the bodies of all nodes
    const deepTraverse = node => {
      // Call the callback to notify that a node has been found
      if (typeof callback === 'function')
        callback.call(this, node, parentNode);

      // Traverse any node property (body, consequent, ...) that may contain
      // statements/expressions or declarations.
      this.traverse(node.body, callback, node);
      this.traverse(node.consequent, callback, node);
      this.traverse(node.alternate, callback, node);
      this.traverse(node.cases, callback, node);
    };

    // Array of nodes passed in, go through each of those nodes and
    // traverse them too
    if (Array.isArray(node))
      for (let i = 0, len = node.length; i < len; i++)
        deepTraverse(node[i]);

    // Deep traverse into node
    else
      deepTraverse(node);
  };


  /*
   *
   */
  this.getIdentifiers = (node) => {
    let result = '';
    const identifiers = this.tokens.filter(t => t.type === 'Identifier');
    const names = [];

    identifiers.forEach(id => {
      // The node's range-end must be *after* the iterated identifier's
      // range-start
      if (id.range[0] > node.range[1])
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
   */
  this.getModifications = () => {
    const result = [];
    this.traverse([this.tree], (node, parentNode) => {
      // No modifications needed for these types of nodes
      if (ignoreNodes.includes(node.type))
        return;

      // Line numbers
      let ln = node.loc.start.line;
      let parentLn = parentNode ? parentNode.loc.start.line : '';

      // Add scope step to BlockStatements
      if (node.type === 'BlockStatement') {
        const range = '[' + parentNode.range.join() + ']';
        result.push([`__scope__(${parentLn},${range});`, node.range[0] + 1]);
      }

      // Add scope to node that /could/ have a block statement
      else if (parentNode && blockNodes.includes(parentNode.type)) {
        result.push([`{__scope__(${parentLn});`, node.range[0]]);
        result.push(['}', node.range[1]]);
      }

      // Add step to any other node
      else {
        const pairs = this.getIdentifiers(node);
        const range = '[' + node.range.join() + ']';
        result.push([`__step__(${ln},${range},${pairs});`, node.range[1]]);
      }
    });
    return result;
  };


  /*
   *
   */
  this.main = () => {
    // Sort 
    const sortedMods = this.getModifications().sort((a, b) => b[1] - a[1]);

    sortedMods.forEach(mod => {
      // Insert (string)mod[0] at index of (int)mod[1]
      input = input.substring(0, mod[1]) + mod[0] + input.substring(mod[1]);
    });

    return input;
  };


  return this.main();
};
