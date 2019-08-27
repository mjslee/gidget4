export default {
  tree: {},
  flatTree: [],

  // Node types
  blockNodes: ['WhileStatement', 'IfStatement', 'ForStatement'],
  ignoreNodes: ['SwitchCase', 'BreakStatement'],
  parseOptions: { loc: true, range: true, tolerant: true },


  /*
   * Traverse through Abstract Syntax Tree nodes.
   *
   * @param {object} node - Tree node to traverse.
   * @param {function(node, prevNode, i)} callback - Callback to access bodies.
   */
  traverse(node, callback) {
    // Ignore non-object nodes
    if (node == null || typeof node != 'object')
      return

    const self = this

    // Traverse down all nodes in node array
    if (Array.isArray(node))
      return node.forEach(subnode => {
        self.traverse(subnode, callback);
      });

    // Traverse down all property-keys of a node; non-object nodes will be
    // passed but quickly ignored in the next recurse
    Object.keys(node).forEach(key => {
      self.traverse(node[key], callback);
    });

    // Check for body and a valid callback
    if (typeof node.body == 'undefined' || typeof callback != 'function')
      return;

    // Call the callback for each element in the body array
    if (Array.isArray(node.body))
      node.body.forEach(body => {
        callback(body, node, 0);
      });

    // Call the callback
    else
      callback(node.body, node, 1);
  },


  /*
   * Get all identifiers declared after an index.
   *
   * @param {number} index - Index number to search after.
   * @return {string} - String-dictionary.
   */
  getIdentifiersAfter(index) {
    let result = ''
    const identifiers = this.tokens.filter(t => t.type == 'Identifier')
    const names = []

    identifiers.forEach(id => {
      // The node's range-end must be *after* the iterated identifier's
      // range-start
      if (id.range[0] > index)
        return

      // Ignore duplicate identifiers
      const name = id.value
      if (names.includes(name))
        return

      // Add unique identifier name and key-pair for result
      names.push(name)
      result += `'${name}':typeof ${name}!='undefined'?${name}:undefined,`
    });

    return '{' + result + '}'
  },


  /*
   * Get list of patches to make to input string.
   *
   * @return {array} - Array of [['modification text', index]...]
   */
  getPatches() {
    const result = [];
    this.traverse([this.tree], (node, prevNode) => {
      // No modifications needed for these types of nodes
      if (this.ignoreNodes.includes(node.type))
        return;

      // Add to the flat tree
      this.flatTree.push(node);

      // No previous node? We are the root, don't do any of this
      if (typeof prevNode == 'undefined')
        return;

      // Create scope function to generate a __scope__() call
      const ln = prevNode.loc.start.line;
      const range = prevNode.range.join();
      const type = prevNode.type;
      const scope = inside => `;__scope__(${ln},[${range}],'${type}',${inside});`;

      // Add scope step to BlockStatements
      if (node.type == 'BlockStatement') {
        result.push([ scope(true), node.range[0] + 1 ]);
        result.push([ scope(false), node.range[1] - 1 ]);
      }

      // Add scope to node that /could/ have a block statement
      else if (prevNode && this.blockNodes.includes(prevNode.type)) {
        result.push([ '{' + scope(true), node.range[0] ]);
        result.push([ scope(false) + '}', node.range[1] ]);
      }

      // Add step to any other node
      else {
        const ln = node.loc.start.line;
        const pairs = this.getIdentifiersAfter(node.range[1]);
        const range = node.range.join();
        result.push([`;__step__(${ln},[${range}]);`, node.range[0]]);
        result.push([`;__collect__(${pairs});`, node.range[1]]);
      }
    });

    return result;
  },


  /*
   * Run text modifications on an input.
   *
   * @return {string} - Modified input.
   */
  run(input) {
    const esprima = require('esprima');

    // Parse input into AST and tokens
    this.tree = esprima.parseScript(input, this.parseOptions);
    this.tokens = esprima.tokenize(input, this.parseOptions);

    // Sort
    const sortedMods = this.getPatches().sort((a, b) => b[1] - a[1]);
    sortedMods.forEach(mod => {
      // Insert (string)mod[0] at index of (int)mod[1]
      input = input.substring(0, mod[1]) + mod[0] + input.substring(mod[1]);
    });

    this.flatTree.reverse();
    input += `;__step__(0, [0, 0]);`;
    return input;
  },
};
