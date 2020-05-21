import { explainNode } from '@/assets/gidget/lang/js-explainer';

//
const esprima = require('esprima');
const codeToTree = (input) => {
  let tree = esprima.parse(input, { loc: true, tolerant: true })
  console.log(JSON.stringify(tree, null, 2))
  return tree;
};


describe('explaining statements', () => {
  test('code', () => {
    const tree = codeToTree(`
    let x = x + 5 * (() => true)();
    if (x > 5) {
      console.log('true');
    }
    `);
    tree.body.forEach((el) => console.log(explainNode(el)));
  });

  test('if statements', () => {
    const tree = codeToTree('if (a == b) { true; } else { false; }');
    tree.body.forEach((el) => console.log(explainNode(el)));
  });

  test('for statements', () => {
    const tree = codeToTree('for (let i = 0; i < 5; i++) { true; }');
    tree.body.forEach((el) => console.log(explainNode(el)));
  });

  test('functions', () => {
    const tree = codeToTree('function wow({ f }) { true; }');
    tree.body.forEach((el) => console.log(explainNode(el)));
  });

  test('member 2expression', () => {
    const tree = codeToTree('Carl["Hello"].test');
    tree.body.forEach((el) => console.log(explainNode(el)));
  });

  test('member expression', () => {
    const tree = codeToTree('Carl.Hello');
    tree.body.forEach((el) => console.log(explainNode(el)));
  });

  test('array', () => {
    const tree = codeToTree('[1,2,3]');
    tree.body.forEach((el) => console.log(explainNode(el)));
  });

  test('assignment', () => {
    const tree = codeToTree('a=b, b=a');
    tree.body.forEach((el) => console.log(explainNode(el)));
  });
});
