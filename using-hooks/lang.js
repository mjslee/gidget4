const JSWalker = {
  __blockStatements: ['WhileStatement', 'IfStatement', 'ForStatement'],

  steps: [],


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
    //get line number from thing
    return esprima.tokenize(input, { loc: true, range: true })
      .filter(token => token.type === 'Identifier')
  },


  inject(tree, input) {
    let result = [];

    // Get all identifiers and create argument list for __endLine
    // const identifierNames = [];
    const identifiers = this.getIdentifiers(input);
    identifiers.forEach(id => {
      let value = '\'' + id.value + '\'';
      // if (!identifierNames.includes(value)) 
      //   identifierNames.push(value);
    });

    //result.push(['__allVars(' + identifierNames.join(',') + ');', 0]);

    this.traverse([tree], (node, nodeParent) => {
      // Ignore these
      if (node.type === 'SwitchCase' || node.type === 'BreakStatement')
        return;

      let ln = node.loc.start.line;  // Line number

      // Add text around the inside of blocks
      if (node.type === 'BlockStatement') {
        // result.push([`__enterScope(${ln});`, node.range[0] + 1]);
        // result.push([`__exitScope(${ln});`, node.range[1] - 1]);
      }

      // Add text around expressions
      else {
        let pairs = '';
        identifiers.forEach(id => {
          if (id.range[0] < node.range[1])
            pairs += `'${id.value}':typeof ${id.value}!=='undefined'?${id.value}:0,`;
        });

        //result.push([`__startLine(${ln});`, node.range[0]]);
        result.push([`__expr__(${ln}, {${pairs}});`, node.range[1]]);
      }

      // Add blocks around statements
      if (
        nodeParent && this.__blockStatements.includes(nodeParent.type) &&
        node.type !== 'BlockStatement'
      ) {
        // Add opening paren
        result.push(['{', node.range[0]]);

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

      const __this = this;
      const __startLine = (line) => {
        console.log('Line started: ', line);
      };
      const __spy = (line) => {
        //console.log('Spied on: ', line);
        return undefined;
      };
      const __expr__ = (ln, ...vars) => {
        console.log('Line: ', ln, vars);
        console.log(this);
      };
      const __enterScope = (line) => {}
      const __exitScope = (line, ...args) => {
        console.log(args);
      }
      const __allVars = (...args) => {
        for (let i = 0, len = args.length; i < len; i++) {
          //console.log(args[i]);
          //console.log(this[args[i]]);
        }
      };

      console.log(debugInput);
      //eval("__allVars('console','log');console.log('Wow');__endLine(1, {'console':typeof console?console:0,'log':typeof log});__endLine(1, {'console':typeof console?console:0,'log':typeof log});");
      eval(debugInput);
    }).call();
  }

};
