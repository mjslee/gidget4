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

    game.initialState = game.world.getState();

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
   * Set current step and state by index.
   *
   * @param {number} index
   * @return {boolean}
   */
  async set(index) {
    // Restore initial game state when passed a value less than 0
    if (index < 0)
      return this.world.restoreState(this.initialState);

    // Already have a saved state? Use it
    if (index < this.stepper.index) {
      const step = this.stepper.steps[index];
      if (!step)
        return;

      // Call step callback
      if (typeof this.onStep === 'function')
        this.onStep(step);

      return this.world.restoreState(step.state);
    }

    // If we have gotten this far then we need the state of a step that hasn't
    // been collected yet

    // Call 'next' until we reached the desired state or no further steps exist
    while (index >= this.stepper.index) {
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
      step.state = this.world.getState();
    }

    // Catch user/parse error
    catch (e) {
      // Call error callback
      if (callCallbacks && typeof this.onError === 'function')
        this.onError(step.ln, e.message);
      return;
    }

    finally {
      // Call step callback
      if (callCallbacks && typeof this.onStep === 'function')
        this.onStep(step);

      // Call finish callback if there is no next step
      if (callCallbacks && !step.hasNext && typeof this.onFinish === 'function')
        this.onFinish(step);
    }

    return step;
  },


  /**
   * Run all stepper steps.
   *
   * @param {number} wait - Milliseconds to wait between steps.
   * @return {void}
   */
  async run(wait=0) {
    let step;
    do {
      // Run the next step
      step = await this.next(wait > 0);

      // Wait for 'wait' milliseconds
      if (step && step.cmd && wait > 0)
        await new Promise(resolve => setTimeout(resolve, wait));
    }
    while(step && step.hasNext);
  }
}
