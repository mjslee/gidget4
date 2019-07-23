import JsStepper from '@/assets/gidget/lang/js-stepper'
import GidgetWorld from './gidget-world'
import GidgetImports from './imports'


export default {
  index: 0,
  key: 0,
  world: undefined,
  states: [],

  initialState: undefined,
  initialData: undefined,


  /**
   * Creates an instance of GidgetGame.
   *
   * @param {array[object]} objects - GameObjects to insert on creation.
   * @param {array[string]} imports - Global imports to insert.
   * @param {object} attrs - Attributes to merge into world.
   * @return {object} An instance of GidgetGame.
   */
  create(gameObjects, imports, attrs) {
    // Create a deep clone of this object so we won't mutate this one
    // and then we'll use self to set up our GidgetGame clone
    const self = _.cloneDeep(this)

    // Create and assign a GidgetWorld object to our game. Our attributes will
    // be merged into the new world
    self.world = GidgetWorld.create(attrs)

    // Merge in global imports
    self.imports = {}
    for (let i = 0, len = imports.length; i < len; i++)
      Object.assign(self.imports, _.cloneDeep(GidgetImports[imports[i]]))

    // Set up the javascript stepper, set the onStep callback so the world
    // states can be saved on each step
    self.stepper = JsStepper.create();
    self.stepper.onStep = () => self.save()

    // Create game objects, then save the initial game state that we can
    // restore on reset
    gameObjects.forEach(gameobject => self.world.createObject(gameobject))

    // Save initial world state and data so they can be restored on reset
    self.initialState = self.world.getState()
    self.initialData = self.world.getObjectsSanitized()

    return self;
  },


  /**
   * Resets the game by resetting the stepper and restoring the intial game
   * state.
   *
   * @return {void}
   */
  reset() {
    // Reset code stepper for a clean run
    this.stepper.reset();

    // Clear states and restore the world to its initial state
    this.states = []
    return this.set(-1, false)
  },


  /**
   * Saves world state and causes a game tick.
   *
   * @return {void}
   */
  save() {
    this.states.push(this.world.getState())
    this.world.gameTick()
  },


  /**
   * Sets the game to a state.
   * An invalid index will restore the game to its initial state.
   *
   * @param {number} index - Index of state to be restored.
   * @return {object} The step belonging to specified index.
   */
  async set(index, runHooks=true) {
    // Get state to restore
    const state =
      // If the index is invalid then use the initial state
      0 > index >= this.states.length ? _.cloneDeep(this.initialState) :

      // Get state at the specified index
      this.states[index]

    // Validate state exists
    if (typeof state != 'object')
      return

    // Determine if step is going in a positive, forward direction
    const isPositive = index > this.index
    this.index = index

    // Run pre-restore hooks
    if (runHooks && isPositive) {
      await this.runHooks(state, hook => hook.when == 'before')

      // Increment update key so any hook callbacks that are running can
      // be cancelled
      this.key += 1
    }

    // Restore the world state
    this.world.restoreState(state)

    // Run post-restore hooks
    if (runHooks && isPositive)
      await this.runHooks(state, hook => hook.when == 'after')

    // Get the current step and assign 'gameData' property to store a
    // combination of gameobjects and game data. If 'gameData' is already
    // assigned then skip this to avoid unnecessary processing.
    let step = this.stepper.steps[index - 1]

    if (step && step.data && !step.gameData) {
      const gameObjects = this.world.getObjectsSanitized()
      step.gameData = Object.assign(_.cloneDeep(step.data), gameObjects)
    }

    // If there is no step, we should create a fake step that contains the data
    // for a reset
    if (!step)
      step = { gameData: _.cloneDeep(this.initialData) }

    // Return the step for further processing
    step.hasNext = index < this.stepper.steps.length - 1
    return step
  },


  /**
   * Runs hooks from the a world state depending on conditions.
   *
   * @param {object} state - World state object that contains hooks.
   * @param {conditions} state - World state object that contains hooks.
   * @return {boolean} Hooks ran.
   */
  async runHooks(state, conditions) {
    // Ensure we have hooks to run
    if (typeof state.hooks != 'object')
      return false

    // Filter hooks by specified conditions
    const hooks = state.hooks.filter(conditions)
    if (!hooks.length)
      return false

    // Store an update key; when another restore happens this key will be
    // incremented but keyCopy will keep the same value. If these two variables
    // are not equal then we know the state has changed we shouldn't run any
    // further hooks from this state
    const keyCopy = this.key, wasInterrupted = () => keyCopy != this.key

    // Run each callback if it's a function then collect the results.
    // Hooks callback functions retain their 'this' but are also passed the
    // 'wasInterrupted' function so the hook can determine if it needs to stop.
    const results = []
    for (let i = 0, len = hooks.length; i < len; i++)
      if (typeof hooks[i].callback == 'function' && !wasInterrupted())
        results.push(await hooks[i].callback.call(null, wasInterrupted))

    // Hook results can be callback functions for cleaning up
    for (let i = 0, len = results.length; i < len; i++)
      if (typeof results[i] == 'function')
        await results[i].call()

    return true
  },


  /**
   * Returns an object of objects that have been exposed.
   *
   * @param {object} extraImports - Imports to expose.
   * @return {object} Object of game objects.
   */
  getExposed() {
    // Object to collect imports
    const exposed = {}

    // Merge extra imports into the exposed result
    if (typeof this.imports == 'object')
      Object.assign(exposed, this.imports)

    // Merge the game objects; game objects are more important than
    // extra imports, so if we have a conflict where a game object and an extra
    // import have the same key then game objects will take precedence.
    const gameObjects = this.world.getObjects()
    Object.assign(exposed, gameObjects)

    // Loop over each of the newly merged elements
    for (const prop in exposed) {
      if (!exposed.hasOwnProperty(prop))
        continue

      // Enclose imported functions in another function with its scope being set
      // to the game world.
      if (typeof exposed[prop] == 'function') {
        const func = exposed[prop]
        exposed[prop] = (...args) => func.call(this.world, ...args)
      }

      // When a merged objects has an 'exposed' object property, re-assign the
      // property of 'exposed' to be the exposed property of the object.
      else if (typeof exposed[prop].exposed == 'object')
        exposed[prop] = exposed[prop].exposed
    }

    // Return the collection
    return exposed
  },


  /**
   * Runs code.
   *
   * @param {string} code - JavaScript code to evaluate.
   * @return {object} Details of the code evaluation.
   */
  run(code) {
    // Run stepper with the code and the exposed game objects and imports
    const result = this.stepper.run(code, this.getExposed())

    // Restore first state; this stops the final positions from being
    // revealed (and a potential animation glitch)
    if (result)
      this.set(0, false)

    return result
  }
}
