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
  traverseNode(node, traverseCallback, childCallback) {
    // Ignore non-object nodes
    if (node == null || typeof node != 'object')
      return

    // Traverse down all nodes in node array
    if (Array.isArray(node))
      return node.forEach((subnode) => {
        this.traverseNode(subnode, traverseCallback, childCallback);
      });

    // Traverse down all property-keys of a node; non-object nodes will be
    // passed but quickly ignored in the next recurse
    Object.keys(node).forEach((key) => {
      this.traverseNode(node[key], traverseCallback, childCallback);
    });

    // Check for body and a valid callback
    const childNode = childCallback(node);
    if (typeof childNode == 'undefined')
      return;

    // Call the callback for each element in the body array
    if (Array.isArray(childNode))
      childNode.forEach((child) => {
        traverseCallback(child, node, 0);
      });

    // Call the callback
    else
      traverseCallback(childNode, node, 1);
  },


  /*
   * Get list of patches to make to input string.
   *
   * @return {array} - Array of [['modification text', index]...]
   */
  traverseTree() {
    const result = [];

    /**
     * Traverse and process node.
     */
    const traverse = (node, prevNode) => {
      // No modifications needed for these types of nodes
      if (this.ignoreNodes.includes(node.type))
        return;

      // Add to the flat tree
      this.flatTree.push(node);

      // No previous node? We are the root, don't do any of this
      if (typeof prevNode == 'undefined')
        return;

      // Create scope function to generate a __scope__() call
      let ln = prevNode.loc.start.line;
      let range = prevNode.range.join();
      const type = prevNode.type;
      const scope = (inside) => `;__scope__(${ln},[${range}],'${type}',${inside});`;

      // Add scope step to BlockStatements
      if (node.type == 'BlockStatement') {
        result.push([ scope(true), node.range[0] + 1 ]);
        result.push([ scope(false), node.range[1] - 1 ]);
        return;
      }

      // Add scope to node that /could/ have a block statement
      else if (prevNode && this.blockNodes.includes(type)) {
        result.push([ '{' + scope(true), node.range[0] ]);
        result.push([ scope(false) + '}', node.range[1] ]);
        return;
      }

      // Add step to any other node
      ln = node.loc.start.line;
      range = node.range.join();
      const pairs = this.getIdentifiersAfter(node.range[1]);
      result.push([`;__step__(${ln},[${range}]);`, node.range[0]]);
      result.push([`;__collect__(${pairs});`, node.range[1]]);
    };

    /**
     * Find child node to traverse.
     */
    const child = (node) => {
      if (typeof node.body != 'undefined')
        return node.body;
    };

    this.traverseNode(this.tree, traverse, child);
    return result;
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
   * Run text modifications on an input.
   *
   * @return {string} - Modified input.
   */
  run(input) {
    const esprima = require('esprima');

    // Parse input into AST and tokens
    this.tree = esprima.parse(input, this.parseOptions);
    this.tokens = esprima.tokenize(input, this.parseOptions);

    // Sort
    const sortedMods = this.traverseTree().sort((a, b) => b[1] - a[1]);
    sortedMods.forEach(mod => {
      // Insert (string)mod[0] at index of (int)mod[1]
      input = input.substring(0, mod[1]) + mod[0] + input.substring(mod[1]);
    });

    this.flatTree.reverse();
    input += `;__step__(0, [0, 0]);`;
    return input;
  },
};
