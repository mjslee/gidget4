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


test('__scope__ sets scope property of last step', () => {
  const range = [0, 1]
  const ln = 5

  const stepper = JsStepper.create()
  stepper.steps = [{}, { ln, range }]  // two steps
  stepper.__scope__(ln, range, 'scope', true)

  expect(typeof stepper.steps[1].scope).toBe('object')
})
