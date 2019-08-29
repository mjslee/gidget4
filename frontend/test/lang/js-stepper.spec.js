import JsStepper from '@/assets/gidget/lang/js-stepper'


describe('stepper initialization', () => {
  test('create stepper instance', () => {
    const stepper = JsStepper.create()
    expect(typeof stepper).toBe('object')
    expect(stepper.steps.length).toBe(0)
  })


  test('reset stepper', () => {
    const stepper = JsStepper.create()
    stepper.steps = [1, 2, 3]
    stepper.debugInput = '123'
    expect(stepper.steps.length).toBe(3)
    expect(stepper.debugInput).toBe('123')

    // Reset stepper and test changes
    stepper.reset()
    expect(stepper.steps.length).toBe(0)
    expect(stepper.debugInput).toBe(undefined)
  })
})


describe('syntax scope', () => {
  test('__scope__ sets scope property', () => {
    const range = [0, 1]
    const ln = 5

    const stepper = JsStepper.create()
    stepper.steps = [{}, { ln, range }]  // two steps
    stepper.__scope__(ln, range, 'scope', true)

    const scope = stepper.steps[1].scope
    expect(typeof scope).toBe('object')
    expect(scope.type).toBe('scope')
    expect(scope.inside).toBe(true)
  })
})


describe('collecting data', () => {
  let proxyTampered = 0  // should never be true
  const obj = { testValue: 'abc' }
  const data = {
    testValue: 'hello world',
    proxyObject: new Proxy(obj, {
      get: (target, prop) => {
        // proxy tampered will be set 1 if this proxy object returns a property
        proxyTampered++
        return target[prop]
      }    
    })
  }

  const stepper = JsStepper.create()
  stepper.steps = [{}, {}]  // two steps
  stepper.__collect__(data)  // run step collection

  const step = stepper.steps[1]

  test('__collect__ sets data property', () => {
    expect(typeof step.data).toBe('object')
    expect(step.data.testValue).toBe('hello world')
  })

  test('__collect__ removes object proxy handlers', () => {
    // because Proxy is removed, proxyTampered should not be incremented on
    // property fetch
    const proxyObject = step.data.proxyObject
    expect(proxyObject.testValue).toBe('abc')  // proxyTampered would be 1
    expect(proxyObject.testValue).toBe('abc')  // proxyTampered would be 2
    expect(proxyObject.testValue).toBe('abc')  // proxyTampered would be 3
    expect(proxyTampered).toBe(1)
  })
})


describe('stepping', () => {
  const stepper = JsStepper.create()

  let onStepCalled = false
  stepper.onStep = () => { onStepCalled = true }
  stepper.__step__(0, [0, 5])  // line 0, range 0-5

  test('__step__ adds step', () => {
    expect(stepper.steps.length).toBe(1)
    expect(stepper.steps[0].index).toBe(0)
    expect(stepper.steps[0].ln).toBe(0)
    expect(stepper.steps[0].range[0]).toBe(0)
    expect(stepper.steps[0].range[1]).toBe(5)

    // add another step for good measure
    stepper.__step__(4, [10, 20])  // line 4, range 10-20
    expect(stepper.steps.length).toBe(2)
    expect(stepper.steps[1].index).toBe(1)
    expect(stepper.steps[1].ln).toBe(4)
    expect(stepper.steps[1].range[0]).toBe(10)
    expect(stepper.steps[1].range[1]).toBe(20)
  })

  test('onStep callback is called', () => {
    expect(onStepCalled).toBe(true)
  })
})


describe('running', () => {
  test('compile time error returns error dictionary', () => {
    const code = `// first line
      /* second line */ this is invalid syntax`

    const stepper = JsStepper.create()
    const result = stepper.run(code)

    expect(typeof result.error).toBe('object')
    expect(result.error.ln).toBe(2)
    expect(result.error.name).toBe('ParseError')
    expect(result.error.text).toBe('Line 2: Unexpected identifier')
  })
})
