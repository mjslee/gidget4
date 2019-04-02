const JSWalker = {
  steps: [],
  __blockStatements: ['WhileStatement', 'IfStatement', 'ForStatement'],

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
    const result = [];
    esprima.tokenize(input)
      .filter(token => token.type === 'Identifier')
      .forEach(identifier =>
        !result.includes(identifier.value) && result.push(identifier.value));
    return result;
  },


  run(input) {
    const ast = this.toTree(input);

    let identifiers = this.getIdentifiers(input);
    let v = '';  // Variables
    identifiers.forEach(identifier => {
      v += ',' + identifier;
    });

    let textModifications = [];
    this.traverse([ast], (node, nodeParent) => {
      // Ignore these
      if (node.type === 'SwitchCase' || node.type === 'BreakStatement')
        return;

      let n = node.loc.start.line;  // Line number

      // Add text around the inside of blocks
      if (node.type === 'BlockStatement') {
        textModifications.push([`__enterScope(${n});`, node.range[0] + 1]);
        textModifications.push([`__exitScope(${n});`, node.range[1] - 1]);
      }

      // Add text around expressions
      else {
        textModifications.push([`__startLine(${n});`, node.range[0]]);
        textModifications.push([`__endLine(${n+v});`, node.range[1]]);
      }

      // Add blocks around statements
      if (
        nodeParent && this.__blockStatements.includes(nodeParent.type) &&
        node.type !== 'BlockStatement'
      ) {
        // Add opening paren
        textModifications.push(['{', node.range[0]]);

        // Add closing paren
        textModifications.push(['}', node.range[1]]);
      }
    });

    textModifications.sort((a, b) => b[1] - a[1]).forEach((mod) => {
      input = input.substring(0, mod[1]) + mod[0] + input.substring(mod[1]);
    });

    console.log('');
    console.log(input);

    // window.input=input;
    // console.log(input);

    /*let result = '';
    for (let i = 0, len = lines.length; i < len; i++)
      result += this.inject(i, lines[i]);

    this.inputCode = input;
    console.log(result);

    (() => {
      const window = undefined;
      const document = undefined;

      const __this = this;
      const __startLine = this.startLine;
      const __endLine = this.endLine;

      eval(result);
    }).call();
    */
  }

};
