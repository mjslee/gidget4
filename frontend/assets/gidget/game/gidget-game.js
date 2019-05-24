import _ from 'lodash';
import GidgetWorld from '@/assets/gidget/game/gidget-world';
import Stepper from '@/assets/gidget/lang/js-stepper';



export default {
  world: undefined,
  stepper: undefined,
  states: [],


  /**
   * Create instance of GidgetGame.
   *
   * @param {object} kwargs - Keyword-arguments to merge into new instance.
   * @return {object} - Game object.
   */
  create(kwargs) {
    const game = _.cloneDeep(this);
    game.stepper = Stepper.create();
    game.world = GidgetWorld.create(kwargs);
    return game;
  },


  /**
   * Save state of world and stepper.
   *
   * @return {void}
   */
  getState() {
    const state = _.cloneDeep({
      objects: this.world.objects,
      messages: this.world.messages
    });

    this.states.push(state)
    return state;
  },


  /**
   * Restore state of world and stepper.
   *
   * @param {object} state
   * @return {boolean}
   */
  restoreState(state) {
    this.world.objects = state.objects;
    this.world.messages = state.messages;

    const fixWorld = node => {
      // Traverse into array
      if (Array.isArray(node))
        node.forEach(subNode => fixWorld(subNode));

      // Restore world property and traverse into grabbed property
      else if (typeof node === 'object') {
        node.world = this.world;
        if (typeof node.grabbed !== 'undefined')
          fixWorld(node.grabbed);
      }
    };

    // Fix world properties inside objects
    fixWorld(this.world.objects);
    return true;
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
  importsWithObjects(imports) {
    const result = Object.assign({}, imports);

    const objects = this.world.getObjectsGrouped();
    Object.keys(objects).forEach(key => {
      // Add exposed GidgetObject methods
      if (typeof objects[key].exposed === 'object')
        result[key] = objects[key].exposed;
    });

    return result;
  },


  /**
   * Reset game world by creating new stepper instance and restoring the game
   * to its initial state.
   *
   * @return void
   */
  reset() {
    // Reset stepper
    this.stepper = Stepper.create();

    // Restore initial state
    if (this.states.length > 0)
      this.restoreState(this.states[0]);

    // Reset states
    this.states = [];
  },


  /**
   * Run script until it hits a breakpoint or ends.
   *
   * @param {String} code - JavaScript code to evaluate.
   * @param {Array[Object]} imports - Game external imports.
   * @return {boolean}
   */
  evaluate(code, imports) {
    const result = this.stepper.run(code, this.importsWithObjects(imports));

    // Parsing error, call error callback
    if (result.hasError) {
      if (typeof this.onError === 'function')
        this.onError(result.error.ln, result.error.message);
    }

    return !result.hasError;
  },


  /**
   * Restore game progress by step index.
   *
   * @param {number} index
   * @return {boolean}
   */
  async restore(index) {
    // Get step and verify its defined
    let step = this.stepper.steps[index];
    if (!step)
      return false;

    // Check for state prop and restore it
    if (typeof step.state === 'object') {
      this.restoreState(step.state);

      // Call onStep callback
      if (typeof this.onStep === 'function')
        this.onStep(step);

      // Call finish callback
      if (!step.hasNext && typeof this.onFinish === 'function')
        this.onFinish();
    }

    // No state prop? We'll have to navigate to it
    else
      for (let i = index - this.stepper.index; i >= 0; i--)
        step = await this.next();

    return true;
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

      step.state = this.getState();
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
    const callCallbacks = wait > 0;

    let step;
    do {
      // Run the next step
      step = await this.next(callCallbacks);

      // Wait for 'wait' milliseconds
      if (wait > 0)
        await new Promise(resolve => setTimeout(resolve, wait));
    }
    while(step);
  }
}
