/**
 * Traverse through Abstract Syntax Tree nodes.
 *
 * @param {object} node - Tree node to traverse.
 * @param {function(node, parentNode, i)} callback - Callback to access bodies.
 */
export function traverseNode (node, traverseCallback, childTraverseCallback) {
  // Ignore non-object nodes
  if (node == null || typeof node != 'object')
    return;

  // Traverse down all nodes in node array
  if (Array.isArray(node))
    return node.forEach((subnode) => {
      traverseNode(subnode, traverseCallback, childTraverseCallback);
    });

  // Traverse down all property-keys of a node; non-object nodes will be
  // passed but quickly ignored in the next recurse
  Object.keys(node).forEach((key) => {
    traverseNode(node[key], traverseCallback, childTraverseCallback);
  });

  // Check for valid callback
  const childNode = childTraverseCallback(node);
  if (typeof childNode == 'undefined')
    return;

  // Call the callback for each element in the body array
  if (Array.isArray(childNode))
    childNode.forEach((child) => traverseCallback(child, node, 0));

  // Call the callback
  else
    traverseCallback(childNode, node, 1);
};


/**
 * Flatten node into an indexed array.
 *
 * @param {[TODO:type]} node - [TODO:description]
 * @return {[TODO:type]} [TODO:description]
 */
export function flattenNode (node) {
  let id = 0;
  const result = [];

  /**
   * Traverse node.
   */
  const traverse = (node, parentNode) => {
    node.id = id++;
    node.parent = parentNode ? parentNode.id : 0;
    result.push(node);
  };

  /**
   * Traverse child nodes.
   */
  const traverseChild = (node) => {
    if (typeof node.body != 'undefined')
      return node.body;
  };

  traverseNode(node, traverse, traverseChild);
  return result;
};
