import JsInjector from '@/assets/gidget/lang/js-injector'


describe('node traversal', () => {
  test('multi-body nested node', () => {
    const node = { 'body': [{}, {}] }
    JsInjector.traverse(node, (_, __, num) =>
      expect(num).toBe(0))
  })

  test('single-body nested node', () => {
    const node = { 'body': { 'body': [] } }
    JsInjector.traverse(node, (_, __, num) =>
      expect(num).toBe(1))
  })
})
