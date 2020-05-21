const nodeExplanations = {
  // Example: [1, 2, 3]
  ArrayPattern: {
    text({ elements }) {
      return `array(${elements.length})`;
    },

    explain({ elements }, getText) {
      return ``;
    }
  },

  RestElement: {
    text({ argument }) {
      return ``;
    },
    explain({ argument }) {
      return ``;
    }
  },

  // Example: a = b
  AssignmentPattern: {
    text({ left, right }, t) {
      return `${t(left)}=${t(right)}`;
    },
    explain({ left, right }, t) {
      return `${t(left)}=${t(right)}`;
    }
  },

  ObjectPattern: {
    text({ properties }) {
      return ``;
    },
    explain({ properties }) {
      return ``;
    }
  },

  ThisExpression: {
    text() {
      return 'this';
    },
    explain() {
      return ``;
    }
  },

  // Example: identifier
  Identifier: {
    text({ name }) {
      return name;
    },
    explain({ name }) {
      return ``;
    }
  },

  // Example: '1'
  Literal: {
    text({ raw }) {
      return raw;
    },
    explain({ raw }) {
      retuen ``;
    }
  },

  ArrayExpression: {
    text({ elements }) {
      return `array(${elements.length})`;
    },
    explain({ elements }) {
      return ``;
    }
  },

  ObjectExpression: {
    text({ properties }) {
      return ``;
    },
    explain({ properties }) {
      return ``;
    }
  },

  Property: {
    text({ kind, key, value }) {
      return ``;
    },
    explain({ kind, key, value }) {
      return ``;
    }
  },

  FunctionExpression: {
    text({ id }, t) {
      return `function ${t(id)}`;
    },
    explain({ id, params, body }) {
      return ``;
    }
  },

  ArrowFunctionExpression: {
    text({ id, params, body }) {
      return ``;
    },
    explain({ id, params, body }) {
      return ``;
    }
  },

  ClassExpression: {
    text({ id, superClass, body }) {
      return ``;
    },
    explain({ id, superClass, body }) {
      return ``;
    }
  },

  ClassBody: {
    text({ body }) {
      return ``;
    },
    explain({ body }) {
      return ``;
    }
  },
  
  MethodDefinition: {
    text({ kind, key, value }) {
      return ``;
    },
    explain({ kind, key, value }) {
      return ``;
    }
  },

  TaggedTemplateExpression: {
    text({ tag, quasi }) {
      return ``;
    },
    explain({ tag, quasi }) {
      return ``;
    }
  },

  TemplateElement: {
    text({ value }) {
      return ``;
    },
    explain({ value }) {
      return ``;
    }
  },

  TemplateLiteral: {
    text({ quasis, expression }) {
      return ``;
    },
    explain({ quasis, expression }) {
      return ``;
    }
  },

  MemberExpression: {
    text({ object, property }) {
      return ``;
    },
    explain({ object, property }) {
      return ``;
    }
  },

  Super: {
    text() {
      return ``;
    },
    explain() {
      return ``;
    }
  },

  MetaProperty: {
    text({ meta, property }) {
      return ``;
    },
    explain({ meta, property }) {
      return ``;
    }
  },

  CallExpression: {
    text({ callee, argument }) {
      return ``;
    },
    explain({ callee, argument }) {
      return ``;
    }
  },

  NewExpression: {
    text({ callee, argument }) {
      return ``;
    },
    explain({ callee, argument }) {
      return ``;
    }
  },

  Import: {
    text() {
      return ``;
    },
    explain() {
      return ``;
    }
  },

  SpreadElement: {
    text({ argument }) {
      return ``;
    },
    explain({ argument }) {
      return ``;
    }
  },

  UpdateExpression: {
    text({ operator, argument, prefix }) {
      return ``;
    },
    explain({ operator, argument, prefix }) {
      return ``;
    }
  },

  AwaitExpression: {
    text({ argument }) {
      return ``;
    },
    explain({ argument }) {
      return ``;
    }
  },

  UnaryExpression: {
    text({ operator, argument, prefix }) {
      return ``;
    },
    explain({ operator, argument, prefix }) {
      return ``;
    }
  },

  BinaryExpression: {
    text({ operator, left, right }, t) {
      return t(left) + operator + t(right);
    },
    explain({ operator, left, right }) {
      return ``;
    }
  },

  LogicalExpression: {
    text({ operator, argument, prefix }) {
      return ``;
    },
    explain({ operator, argument, prefix }) {
      return ``;
    }
  },

  ConditionalExpression: {
    text({ test, consequent, alternate }) {
      return ``;
    },
    explain({ test, consequent, alternate }) {
      return ``;
    }
  },

  YieldExpression: {
    text({ argument, delegate }) {
      return ``;
    },
    explain({ argument, delegate }) {
      return ``;
    }
  },

  AssignmentExpression: {
    text({ operator, left, right }, t) {
      return t(left) + operator + t(right);
    },
    explain({ operator, left, right }, t) {
      return t(left) + operator + t(right);
    }
  },

  SequenceExpression: {
    text({ expressions }, t) {
      return expressions.map((expression) => t(expression)).join(',');
    },
    explain({ expressions }) {
      return ``;
    }
  },

  BlockStatement: {
    text() {
      return 'block statement';
    },
    explain({ body }) {
      return ``;
    }
  },

  BreakStatement: {
    text() {
      return `break`;
    },
    explain({ label }) {
      return ``;
    }
  },

  ClassDeclaration: {
    text({ id }) {
      return `{class ${id}}`;
    },
    explain: 'ClassDeclaration'
  },

  ContinueStatement: {
    text() {
      return 'continue';
    },
    explain({ label }) {
      return ``;
    }
  },

  DebuggerStatement: {
    text() {
      return `debugger`;
    },
    explain() {
      return ``;
    }
  },

  DoWhileStatement: {
    text() {
      return 'while statement';
    },
    explain({ body, test }) {
      return ``;
    }
  },

  EmptyStatement: {
    text() {
      return 'empty statement';
    },
    explain() {
      return ``;
    }
  },

  ExpressionStatement: {
    text({ expression }, t) {
      return t(expression);
    },
    explain({ expression }, t) {
      return t(expression);
    }
  },

  ForStatement: {
    text: 'for statement',
    explain: (a, b, c, d) => `{${a}} {${b}} {${c} {${d}}}`,
  },

  ForInStatement: {
    text() {
      return `for-in statement`;
    },
    explain({ left, right, body, each }) {
      return ``;
    }
  },

  ForOfStatement: {
    text() {
      return `for-of statement`;
    },
    explain({ left, right, body }) {
      return ``;
    }
  },

  // Example: hello(world) { console.log(true); }
  FunctionDeclaration: {
    text({ id }, t) {
      const idText = t(id);
      return `{${idText}}()`
    },
    explain({ id, params, body }, t) {
      const idText     = t(id);
      const paramsText = t(params);
      const bodyText   = t(body);
      return `{${idText}(${paramsText})} runs {${bodyText}}`;
    }
  },

  IfStatement: {
    text() {
      return 'if statement';
    },
    explain({ test, consequent, alternate }, t) {
      let text = '';

      if (test)
        text += `If {${t(test, 1)}} resolves to a {?truthy} value `;

      if (consequent)
        text += `then the following {${t(consequent, 1)}} will run. `;

      if (alternate) {
        text += 'If it resolves to a {?falsy} value, then the alternate ';
        text += `{${t(alternate, 1)}} will run instead.`;
      }

      return text;
    }
  },

  LabeledStatement: {
    text() {
      return 'labeled statement';
    },
    explain({ label, body }) {
      return ``;
    }
  },

  ReturnStatement: {
    text() {
      return 'return';
    },
    explain({ argument }) {
      return ``;
    }
  },

  SwitchStatement: {
    text() {
      return `switch statement`;
    },
    explain({ discriminant, cases }) {
      return ``;
    }
  },

  SwitchCase: {
    text() {
      return 'switch case';
    },
    explain({ test, consequent }) {
      return ``;
    }
  },

  ThrowStatement: {
    text() {
      return 'throw statement';
    },
    explain({ argument }) {
      return ``;
    }
  },

  TryStatement: {
    text() {
      return 'try statement';
    },
    explain({ block, handler, finalizer }) {
      return ``;
    }
  },

  CatchClause: {
    text() {
      return 'catch clause';
    },
    explain({ param, body }) {
      return ``;
    }
  },

  VariableDeclaration: {
    text({ declarations, kind }) {
      return `hi`;
    },
    explain({ declarations, kind }, t) {
      return declarations.map((declaration) => t(declaration, 0, 'explain')).join(',');
    }
  },

  VariableDeclarator: {
    text({ id, init }, t) {
      return `${t(id)}=${t(init)}`;
    },
    explain({ id, init }, t) {
      return (
        `The variable {${t(id)}} is being declared and initialized with ` +
        `a value of {${t(init)}}.`
      );
    }
  },

  WhileStatement: {
    text() {
      return 'while statement';
    },
    explain({ test, body }) {
      return ``;
    }
  },

  WithStatement: {
    text() {
      return `with statement`;
    },
    explain({ object, body }) {
      return ``;
    }
  },

  Program: {
    text() {
      return 'program';
    },
    explain({ body }) {
      return ``;
    }
  },
};


function stringifyLocation(loc) {
  return typeof loc != 'object' ?  '' :
    `${loc.start.line},${loc.start.column},${loc.end.line},${loc.end.column}!`;
}


export function getNodeText(node, withLocation=false, option='text') {
  const type = nodeExplanations[node.type];
  const location = withLocation ? stringifyLocation(node.loc) : '';

  if (!type)
    return ' [' + node.type + '] ';

  if (typeof type[option] == 'string')
    return location + type[option];

  else if (typeof type[option] == 'function')
    return location + type[option](node, getNodeText);
}


export function explainNode(node) {
  return getNodeText(node, false, 'explain');
}
