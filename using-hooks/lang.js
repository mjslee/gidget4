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


  toTree(input) {
    return esprima.parseScript(input, { range: true, loc: true });
  },


  getIdentifiers(input) {
    //get line number from thing
    const result = [];
    esprima.tokenize(input, { loc: true })
      .filter(token => token.type === 'Identifier')
      .forEach(identifier =>
        !result.includes(identifier.value) && result.push({
          text: identifier.value, line: identifier.loc
        })
      );
    return result;
  },


  inject(tree, input) {
    let result = [];

    // Get all identifiers and create argument list for __endLine
    let p = '';  // Variable Key-Value Pairs

    const identifiers = [];
    const identifierLines = {};
    this.getIdentifiers(input).forEach(id => {
      if (identifiers.includes(id.text))
        return;

      // Add line number
      let ln = id.line.end.line;
      if (typeof identifierLines[ln] === 'undefined')
        identifierLines[ln] = [ ...identifiers, id.text ];
      else
        identifierLines[ln].push(id.text);

      // > id.range[0]

      // identifiers.filter(obj => id.range[0] > obj.range[0])

      identifiers.push(id.text);
      p += '\'' + id.text + '\':' + id.text + ',';
    });

    console.log(identifierLines);

    this.traverse([tree], (node, nodeParent) => {
      // Ignore these
      if (node.type === 'SwitchCase' || node.type === 'BreakStatement')
        return;

      let ln = node.loc.start.line;  // Line number

      // Add text around the inside of blocks
      if (node.type === 'BlockStatement') {
        result.push([`__enterScope(${ln});`, node.range[0] + 1]);
        result.push([`__exitScope(${ln});`, node.range[1] - 1]);
      }

      // Add text around expressions
      else {
        let vars = '';
        if (typeof identifierLines[ln] !== 'undefined') {
          identifierLines[ln].forEach(id => {
            vars += '\'' + id + '\':' + id + ',';
          });
        }
        result.push([`__startLine(${ln});`, node.range[0]]);
        result.push([`__endLine(${ln}, {${vars}});`, node.range[1]]);
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
    let tree = this.toTree(input);
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
      const __endLine = (line, ...vars) => {
        console.log('Line ended: ', line);
      };
      const __enterScope = (line) => {}
      const __exitScope = (line) => {}

      console.log(debugInput);
      eval(debugInput);
    }).call();
  }

};
