export default {
  run(nodes) {

  },

  explainStatement(node) {
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
    switch (true) {
      case 'ThisExpression':
        break;

      case 'Identifier':
        break;

      case 'Literal':
        break;

      case 'ArrayExpression':
        break;

      case 'ObjectExpression':
        break;

      case 'FunctionExpression':
        break;

      case 'ArrowFunctionExpression':
        break;

      case 'ClassExpression':
        break;

      case 'TaggedTemplateExpression':
        break;

      case 'MemberExpression':
        break;

      case 'Super':
        break;

      case 'MetaProperty':
        break;

      case 'NewExpression':
        break;

      case 'CallExpression':
        break;

      case 'UpdateExpression':
        break;

      case 'AwaitExpression':
        break;

      case 'UnaryExpression':
        break;

      case 'BinaryExpression':
        break;

      case 'LogicalExpression':
        break;

      case 'ConditionalExpression':
        break;

      case 'YieldExpression':
        break;

      case 'AssignmentExpression':
        break;

      case 'SequenceExpression':
        break;
    }
  }
}
