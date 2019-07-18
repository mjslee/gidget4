import JSStepper from '@/assets/gidget/lang/js-stepper'
import GidgetWorld from '@/assets/gidget/game/gidget-world'



export default {
  world: undefined,
  states: [],


  /**
   * Creates an instance of GidgetGame.
   *
   * @param {array[object]} objects - GameObjects to insert on creation.
   * @param {object} attrs - Attributes to merge into world.
   * @return {object} An instance of GidgetGame.
   */
  create(gameobjects, attrs) {
    // Create a deep clone of this object so we won't mutate this one
    // and then we'll use self to set up our GidgetGame clone
    const self = _.cloneDeep(this)

    // Create and assign a GidgetWorld object to our game. Our attributes will
    // be merged into the new world
    self.world = GidgetWorld.create(attrs)

    // Set up the javascript stepper, set the onStep callback so the world
    // states can be saved on each step
    self.stepper = JSStepper.create();
    self.stepper.onStep = () => self.save()

    // Create game objects, then save the initial game state that we can
    // restore on reset
    gameobjects.forEach(gameobject => self.world.createObject(gameobject))
    self.states.push(self.world.getState())

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

    // Restore the world to its initial state, then re-add the intial state
    // to this object so it can be re-used again and again for resets
    this.world.restoreState(this.states[0])
    this.states = [this.states[0]]
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
   *
   * @param {number} index - Index of state to be restored.
   * @return {object} The step belonging to specified index.
   */
  async set(index) {
    // Because we set an initial state on creation, there will always be one
    // more state than step so we'll need to add one to the index
    index += 1

    // Ensure index is valid
    if (index < 0 || index >= this.stepper.steps.length + 1)
      return undefined

    // Get state at index or return
    const state = this.states[index]
    if (!state)
      return undefined

    // TODO: Simplify callback system
    // Run pre-restore callbacks
    await this.runCallbacks('before', state)

    // Restore the world state
    this.world.restoreState(state)

    // Run post-restore callbacks
    await this.runCallbacks('after', state)

    // Get the current step and assign 'gameData' property to store a
    // combination of gameobjects and game data. If 'gameData' is already
    // assigned then skip this to avoid unnecessary processing.
    const step = this.stepper.steps[index]
    if (step && step.data && !step.gameData)
      step.gameData = Object.assign(
        _.cloneDeep(step.data), this.world.getObjectsSanitized()
      )

    // Return the step for further processing
    return step
  },


  async runFunctions(functions) {
    if (_.isEmpty(functions))
      return false;

    for (let i = 0, len = functions.length; i < len; i++)
      if (_.isFunction(functions[i]))
        await functions[i]();

    return true;
  },


  async runCallbacks(prefix, state) {
    if (!state[prefix]) {
      state[prefix] = true
      await this.runFunctions(state.callbacks[prefix + 'once'])
    }

    await this.runFunctions(state.callbacks[prefix + 'always'])
  },


  /**
   * Returns an object of objects that have been exposed.
   *
   * @param {object} extraImports - Imports to expose.
   * @return {object} Object of game objects.
   */
  getExposed(extraImports) {
    // Object to collect imports
    const exposed = {}

    // Merge extra imports into the exposed result
    if (typeof extraImports == 'object')
      Object.assign(exposed, extraImports)

    // Merge the game objects; game objects are more important than
    // extra imports, so if we have a conflict where a game object and an extra
    // import have the same key then game objects will take precedence.
    const gameObjects = this.world.getObjects()
    Object.assign(exposed, gameObjects)

    // Loop over each of the newly merged elements; when a merged objects has
    // an 'exposed' object property, re-assign the property of 'exposed' to be
    // the exposed property of the object.
    for (const prop in exposed) {
      if (exposed.hasOwnProperty(prop))
        if (typeof exposed[prop].exposed == 'object')
          exposed[prop] = exposed[prop].exposed
    }

    // Return the collection
    return exposed
  },


  /**
   * Runs code.
   *
   * @param {string} code - JavaScript code to evaluate.
   * @param {object} imports - External game imports.
   * @return {object} Details of the code evaluation.
   */
  run(code, imports) {
    // Assign imports as an object if its not passed in as one
    if (typeof imports != 'object')
      imports = {}

    // Run stepper with the code and the exposed game objects and imports
    const exposedImports = this.getExposed(imports)
    return this.stepper.run(code, exposedImports)
  }
}
