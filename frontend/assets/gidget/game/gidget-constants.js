export const StringDefinition = {
  name: 'String',
  type: 'string',
  description: `
    # String
    ## Literal
    ...
  `,
  example: `
    \`\`\`js
    let x = 'Hello, world!';
    \`\`\`
  `,
};

export const BooleanDefinition = {
  name: 'Boolean',
  type: 'boolean',
  description: `
    # Boolean
    ## Literal
    ...
  `,
  example: `
    \`\`\`js
    let x = true;
    let y = false;
    \`\`\`
  `,
};

export const NumberDefinition = {
  name: 'Number',
  type: 'number',
  description: `
    # Number
    ## Literal
    ...
  `,
  example: `
    \`\`\`js
    let num = 5;
    let dec = 0.1;
    \`\`\`
  `,
};

export const ArrayDefinition = {
  name: 'Array',
  type: 'array',
  description: `
    # Array
    ## Literal
    ...
  `,
  example: `
    \`\`\`js
    const x = [1, 2, 3];
    \`\`\`
  `,
};

export const ObjectDefinition = {
  name: 'Object',
  type: 'object',
  description: `
    # Object
    ## Literal
    ...
  `,
  example: `
    \`\`\`js
    let obj = {
      name: 'ObjectName'
    };
    \`\`\`
  `,
};

export const UndefinedDefinition = {
  name: 'Undefined',
  type: 'undefined',
  description: `
    # Undefined
  `,
  example: `
    \`\`\`js
    let example = undefined;
    \`\`\`
  `,
};
