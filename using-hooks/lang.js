const JSWalker = {

  __steps: [],
  __index: 0,

  __blockStatements: ['WhileStatement', 'IfStatement', 'ForStatement'],

  step() {
    return this.__steps[this.__index++];
  },


  traverse(node, callback, parentNode=undefined) {
    if (node === undefined || node === null)
      return;

    const traverse = node => {
      if (typeof callback === 'function')
        callback.call(this, node, parentNode);

      this.traverse(node.body, callback, node);
      this.traverse(node.consequent, callback, node);
      this.traverse(node.alternate, callback, node);
      this.traverse(node.cases, callback, node);
    };

    if (!Array.isArray(node))
      traverse(node);
    else
      for (let i = 0, len = node.length; i < len; i++)
        traverse(node[i]);
  },


  getIdentifiers(input) {
    return esprima.tokenize(input, { loc: true, range: true })
      .filter(token => token.type === 'Identifier')
  },


  inject(tree, input) {
    let result = [];

    const identifiers = this.getIdentifiers(input);
    this.traverse([tree], (node, parentNode) => {
      // Ignore these
      if (node.type === 'SwitchCase' || node.type === 'BreakStatement')
        return;

      let ln = node.loc.start.line;  // Line number

      // Add text around the inside of blocks
      if (node.type === 'BlockStatement')
        result.push([`__scope__(${parentNode.loc.start.line});`, node.range[0] + 1]);

      // Add text around expressions
      else {
        let pairs = '';
        identifiers.forEach(id => {
          let value = id.value;
          if (id.range[0] < node.range[1])
            pairs += `'${value}':typeof ${value}!=='undefined'?${value}:undefined,`;
        });

        result.push([
          `__expr__(${ln}, ${node.range.join()}, {${pairs}});`, node.range[1]
        ]);
      }

      // Add blocks around statements
      if (
        parentNode && this.__blockStatements.includes(parentNode.type) &&
        node.type !== 'BlockStatement'
      ) {
        // Add opening paren
        result.push([`{__scope__(${parentNode.loc.start.line});`, node.range[0]]);

        // Add closing paren
        result.push(['}', node.range[1]]);
      }
    });

    result.sort((a, b) => b[1] - a[1]).forEach((mod) => {
      input = input.substring(0, mod[1]) + mod[0] + input.substring(mod[1]);
    });
    

    return input;
  },


  run(input) {
    let tree = esprima.parseScript(input, { range: true, loc: true });
    let debugInput = this.inject(tree, input);

    (() => {
      const window = undefined;
      const document = undefined;

      const __scope__ = ln => this.__steps.push({ lineNumber: ln });
      const __expr__ = (ln, from, to, vars) => {
        this.__steps.push({
          lineNumber: ln,
          range: [from, to],
          variables: vars
        });
      };

      eval(debugInput);
    }).apply({});
  }

};



const Stepper = {
  steps: [],
  index: 0,

  /*
   *
   */
  step() {
    return this.steps[this.index++];
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
  __step__(ln, range, data) {
    console.log(ln, range, data);
  },


  /*
   *
   */
  __scope__(ln, range) {
    console.log(ln, range);
  },

   
  /*
   *
   */
  run(input) {
    this.clean();

    this.debugInput = Injector(input);

    const __scope__ = this.__scope__;
    const __step__ = this.__step__;


    const fakeSandbox = () => {
      const window = undefined;
      const document = undefined;

      eval(this.debugInput);
    };

    fakeSandbox.call();
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
      if (node.type === 'BlockStatement')
        result.push([`__scope__(${parentLn});`, node.range[0] + 1]);

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


