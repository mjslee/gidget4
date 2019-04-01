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
    return esprima.parseScript(input, { range: true });
  },



  run(input) {
    //const originalInput = input;
    const ast = this.toTree(input);

    let textModifications = [];
    this.traverse([ast], (node, nodeParent) => {
      console.log(node, nodeParent);

      // Ignore these
      if (node.type === 'SwitchCase' || node.type === 'BreakStatement')
        return;

      // Add text around the inside of blocks
      if (node.type === 'BlockStatement') {
        textModifications.push(['X', node.range[0] + 1]);
        textModifications.push(['Y', node.range[1] - 1]);
      }

      // Add text around expressions
      else {
        textModifications.push(['A', node.range[0]]);
        textModifications.push(['B', node.range[1]]);
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
