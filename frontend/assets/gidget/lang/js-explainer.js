export default {
  run(nodes) {

  },

  explainNode(node) {
    // https://esprima.readthedocs.io/en/latest/syntax-tree-format.html
    const result = [];

    switch (node.type) {
      case 'BlockStatement':
        break;

      case 'BreakStatement':
        break;

      case 'ContinueStatement':
        break;

      case 'DebuggerStatement':
        break;

      case 'DoWhileStatement':
        break;

      case 'EmptyStatement':
        break;

      case 'ExpressionStatement':
        break;

      case 'ForStatement':
        break;

      case 'ForInStatement':
        break;

      case 'ForOfStatement':
        break;

      case 'FunctionDeclaration':
        break;

      case 'IfStatement':
        break;

      case 'LabeledStatement':
        break;
        
      case 'ReturnStatement':
        break;

      case 'SwitchStatement':
        break;

      case 'ThrowStatement':
        break;

      case 'TryStatement':
        break;

      case 'VariableDeclaration':
        break;

      case 'WhileStatement':
        break;

      case 'WithStatement':
        break;
    }

    return result;
  },

  explainExpression(expression) {

  }
}
