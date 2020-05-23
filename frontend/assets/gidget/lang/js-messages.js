export default {
  ArrayPattern: {
    text({ elements }, ) {
      return `array(${elements.length})`;
    },
    explain(getText) {
      return getText('');
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
  AssignmentPattern: {
    text({ left, right }) {
      return ``;
    },
    explain({ left, right }) {
      return ``;
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
      return ``;
    },
    explain() {
      return ``;
    }
  },
  Identifier: {
    text({ name }) {
      return ``;
    },
    explain({ name }) {
      return ``;
    }
  },
  Literal: {
    text({ raw }) {
      return ``;
    },
    explain({ raw }) {
      retuen ``;
    }
  },
  ArrayExpression: {
    text({ elements }) {
      return ``;
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
    text({ id, params, body }) {
      return ``;
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
    text({ operator, left, right }) {
      return ``;
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
    text({ operator, left, right }) {
      return ``;
    },
    explain({ operator, left, right }) {
      return ``;
    }
  },
  SequenceExpression: {
    text({ expressions }) {
      return ``;
    },
    explain({ expressions }) {
      return ``;
    }
  },
  BlockStatement: {
    text({ body }) {
      return ``;
    },
    explain({ body }) {
      return ``;
    }
  },

  BreakStatement: {
    text({ label }) {
      return ``;
    },
    explain({ label }) {
      return ``;
    }
  },

  ClassDeclaration: {
    text({ id, superClass, body }) {
      return `class {${id}}`;
    },
    explain: 'ClassDeclaration'
  },

  ContinueStatement: {
    text({ label }) {
      return ``;
    },
    explain({ label }) {
      return ``;
    }
  },

  DebuggerStatement: {
    text() {
      return ``;
    },
    explain() {
      return ``;
    }
  },

  DoWhileStatement: {
    text({ body, test }) {
      return ``;
    },
    explain({ body, test }) {
      return ``;
    }
  },

  EmptyStatement: {
    text() {
      return ``;
    },
    explain() {
      return ``;
    }
  },

  ExpressionStatement: {
    text({ expression, directive }) {
      return ``;
    },
    explain({ expression, directive }) {
      return ``;
    }
  },

  ForStatement: {
    text: 'for statement',
    explain: (a, b, c, d) => `{${a}} {${b}} {${c} {${d}}}`,
  },

  ForInStatement: {
    text({ left, right, body, each }) {
      return ``;
    },
    explain({ left, right, body, each }) {
      return ``;
    }
  },

  ForOfStatement: {
    text({ left, right, body }) {
      return ``;
    },
    explain({ left, right, body }) {
      return ``;
    }
  },

  FunctionDeclaration: {
    text: (id, params) => `{${id}}(${params})`,
    explain: (id, params, body) => `{${id}(${params})} runs {${body}}`,
  },

  IfStatement: {
    text:       'if statement',
    explain:    ({ test }) => `We need to make sure ${test} resolves to a truthy statement.`,
    consequent: ({ consequent }) => `If it does, then this {${consequent}} will be run.`,
    alternate:  ({ alternate }) => `Otherwise, {${alternate}} will be run.`
  },

  LabeledStatement: {
    text({ label, body }) {
      return ``;
    },
    explain({ label, body }) {
      return ``;
    }
  },

  ReturnStatement: {
    text({ argument }) {
      return ``;
    },
    explain({ argument }) {
      return ``;
    }
  },

  SwitchStatement: {
    text({ discriminant, cases }) {
      return ``;
    },
    explain({ discriminant, cases }) {
      return ``;
    }
  },

  SwitchCase: {
    text({ test, consequent }) {
      return ``;
    },
    explain({ test, consequent }) {
      return ``;
    }
  },

  ThrowStatement: {
    text({ argument }) {
      return ``;
    },
    explain({ argument }) {
      return ``;
    }
  },

  TryStatement: {
    text({ block, handler, finalizer }) {
      return ``;
    },
    explain({ block, handler, finalizer }) {
      return ``;
    }
  },

  CatchClause: {
    text({ param, body }) {
      return ``;
    },
    explain({ param, body }) {
      return ``;
    }
  },

  VariableDeclaration: {
    text({ declarations, kind }) {
      return ``;
    },
    explain({ declarations, kind }) {
      return ``;
    }
  },

  VariableDeclarator: {
    text({ id, init }) {
      return ``;
    },
    explain({ id, init }) {
      return ``;
    }
  },

  WhileStatement: {
    text({ test, body }) {
      return ``;
    },
    explain({ test, body }) {
      return ``;
    }
  },

  WithStatement: {
    text({ object, body }) {
      return ``;
    },
    explain({ object, body }) {
      return ``;
    }
  },

  Program: {
    text({ body }) {
      return ``;
    },
    explain({ body }) {
      return ``;
    }
  },

  ImportSpecifier: {
    text({ local, imported }) {
      return ``;
    },
    explain({ local, imported }) {
      return ``;
    }
  },

  ExportAllDeclaration: {
    text({ source }) {
      return ``;
    },
    explain({ source }) {
      return ``;
    }
  },

  ExportDefaultDeclaration: {
    text({ declaration }) {
      return ``;
    },
    explain({ declaration }) {
      return ``;
    }
  },

  ExportNamedDeclaration: {
    text({ declaration, specifiers, source }) {
      return ``;
    },
    explain({ declaration, specifiers, source }) {
      return ``;
    }
  },

  ExportSpecifier: {
    text({ exported, local }) {
      return ``;
    },
    explain({ exported, local }) {
      return ``;
    }
  }

};
