import _ from 'lodash'
import GidgetWorld from '@/assets/gidget/game/gidget-world'
import Stepper from '@/assets/gidget/lang/js-stepper'



export default {
  world: undefined,
  stepper: undefined,
  initialState: undefined,


  /**
   * Create instance of GidgetGame.
   *
   * @param {array[object]} objects - Objects to insert on creation.
   * @param {object} attrs - Keyword-arguments to merge into new instance.
   * @return {object} - Game object.
   */
  create(objects, attrs) {
    const game = _.cloneDeep(this);
    game.stepper = Stepper.create();
    game.world = GidgetWorld.create(attrs);

    // Insert objects on creation
    game.createObjects(objects);

    // Save initial state for restoration upon reset
    game.states = [game.getState()];
    return game;
  },


  /**
   * Reset game world by creating new stepper instance and restoring the game
   * to its initial state.
   *
   * @return {void}
   */
  reset() {
    // Reset stepper
    this.stepper = Stepper.create();
    this.states = [this.states[0]];

    // Restore initial state
    this.set(-1);
  },


  /**
   * Create game world objects and save the game state.
   *
   * @param {array[object]} objects - Objects to create.
   * @return {void}
   */
  createObjects(objects) {
    objects.forEach(object => this.world.createObject(object));
  },


  /**
   * Add grouped game objects to the imports as their name.
   *
   * @param {Array[Object]} imports - Imports to be merged in on.
   * @return {object}
   */
  getImports(imports) {
    const result = Object.assign({}, imports);

    const objects = this.world.getObjects();
    Object.keys(objects).forEach(key => {
      // Add exposed GidgetObject methods
      if (typeof objects[key].exposed === 'object')
        result[key] = objects[key].exposed;
    });

    return result;
  },


  /**
   * Save state of world and stepper.
   *
   * @return {void}
   */
  getState() {
    return _.cloneDeep({
      objects: this.world.objects,
      messages: this.world.messages
    });
  },


  /**
   * Restore a game state.
   *
   * @param {object} state
   * @return {boolean}
   */
  restoreState(state) {
    if (typeof state === 'undefined')
      return false;

    // Clone state because the references inside of object
    state = _.cloneDeep(state)

    // Set world objects and messages
    this.world.objects = state.objects;
    this.world.messages = state.messages;

    /**
     * Recursively assign world properties inside objects.
     */
    const assignWorld = node => {
      // Traverse into array
      if (Array.isArray(node))
        node.forEach(subNode => assignWorld(subNode));

      // Restore world property
      else if (typeof node === 'object') {
        // Set world property
        node.world = this.world;

        // Traverse into grabbed property
        if (typeof node.grabbed !== 'undefined')
          assignWorld(node.grabbed);
      }
    };

    // Assign world properties inside objects
    assignWorld(this.world.objects);
    return true;
  },


  /**
   * Set current step and state by index.
   *
   * @param {number} index
   * @return {boolean}
   */
  async set(index) {
    // Restore initial game state when passed a value less than 0
    if (index < 0) {
      console.log(1)
      return this.restoreState(this.states[0]);
    }

    // Already have a saved state? Use it
    if (index < this.states.length) {
      console.log(2)
      return this.restoreState(this.states[index]);
    }

    // If we have gotten this far then we need the state of a step that hasn't
    // been collected yet

    // Call 'next' until we reached the desired state or no further steps exist
    while (index >= this.states.length) {
      console.log(3)
      if (!await this.next())
        break;
    }
  },


  /**
   * Run script until it hits a breakpoint or ends.
   *
   * @param {String} code - JavaScript code to evaluate.
   * @param {Array[Object]} imports - Game external imports.
   * @return {boolean}
   */
  evaluate(code, imports) {
    const result = this.stepper.run(code, this.getImports(imports));

    // Parsing error, call error callback
    if (result.hasError && typeof this.onError === 'function')
      this.onError(result.error.ln, result.error.message);

    return !result.hasError;
  },


  /**
   * Run next step in stepper.
   *
   * @param {boolean} callCallbacks
   * @return {boolean}
   */
  async next(callCallbacks=true) {
    // Get step
    let step = this.stepper.next();
    if (!step)
      return;

    // Set stepper index to the next step's index
    this.stepper.index = step.index;

    // Get next step so we can set the nextStep property
    // nextStep property is used to show next line in code editor
    if (step.hasNext)
      step.nextStep = this.stepper.next(1);

    // Try running the step
    try {
      // Wait for next step to complete
      step = await this.stepper.step();

      // Throw parse error
      if (step.hasError)
        throw new Error(step.error.message);

      // Save state
      this.states.push(this.getState());
    }

    // Catch user/parse error
    catch (e) {
      // Call error callback
      if (callCallbacks && typeof this.onError === 'function')
        this.onError(step.ln, e.message);
      return false;
    }

    finally {
      // Call step callback
      if (callCallbacks && typeof this.onStep === 'function')
        this.onStep(step);

      // Call finish callback if there is no next step
      if (callCallbacks && !step.hasNext && typeof this.onFinish === 'function')
        this.onFinish(step);
    }

    return step.hasNext;
  },


  /**
   * Run all stepper steps.
   *
   * @param {number} wait - Milliseconds to wait between step.
   * @return {void}
   */
  async run(wait=0) {
    let hasNext = true;
    do {
      // Run the next step
      hasNext = await this.next(wait > 0);

      // Wait for 'wait' milliseconds
      if (wait > 0)
        await new Promise(resolve => setTimeout(resolve, wait));
    }
    while(hasNext);
  }
}
