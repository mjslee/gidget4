import _ from 'lodash';
import GidgetWorld from '@/assets/gidget/game/gidget-world';
import Stepper from '@/assets/gidget/lang/js-stepper';



export default {
  world: undefined,
  stepper: undefined,
  states: [],


  /**
   * Create GidgetGame instance.
   * @param {object} kwargs - Keyword-arguments to merge into new instance.
   *
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
    const startDate = new Date();

    const state = _.cloneDeep({
      objects: this.world.objects,
      messages: this.world.messages
    });

    this.states.push(state)
    //console.log(`Game saved in ${new Date().getTime()-startDate.getTime()}ms`);
    return state;
  },


  /**
   * Restore state of world and stepper.
   *
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
   *
   */
  restoreStep(step) {
    if (typeof step.state !== 'object')
      return;

    this.restoreState(step.state);
    if (typeof this.onStep === 'function')
      this.onStep(step);
  },


  /**
   * Create game world objects and save the game state.
   *
   * @param {Array[Object]} objects - Objects to create.
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
   * Go to previous state by index.
   *
   * @return {boolean}
   */
  async goto(index) {
    // Get step and verify its defined
    let step = this.stepper.steps[index];
    if (!step)
      return false;

    // Check for state prop and restore it
    if (typeof step.state === 'object')
      this.restoreStep(step);

    // No state prop? We'll have to navigate to it
    else
      for (let i = index - this.stepper.index; i >= 0; i--)
        step = await this.next();

    return true;
  },


  /**
   * Restore previous state.
   *
   * @return {boolean}
   */
  async prev() {
    return (this.stepper.index > 0 && this.stepper.steps.length > 0) ?
      this.goto(--this.stepper.index) :
      false;
  },


  /**
   * Run next step in stepper.
   *
   * @return {boolean}
   */
  async next() {
    // Get step
    let step = this.stepper.next();
    if (!step)
      return;

    this.stepper.index = step.index;

    // Re-use state if it exists
    if (typeof step.state === 'object') {
      this.restoreStep(step);
      console.log('has step');
      this.stepper.index += 1;
      return step.hasNext;
    }

    // Get next step
    if (step.hasNext)
      step.nextStep = this.stepper.next(1);

    // Call step callback
    if (typeof this.onStep === 'function')
      this.onStep(step);

    // Try running the step
    try {
      // Wait for next step to complete
      step = await this.stepper.step();

      // Throw parse error
      if (step.hasError)
        throw new Error(step.error.message);
    }

    // Catch user/parse error
    catch (e) {
      // Call error callback
      if (typeof this.onError === 'function')
        this.onError(step.ln, e.message);
      return false;
    }

    step.state = this.getState();

    // Call finish callback
    if (!step.hasNext && typeof this.onFinish === 'function')
      this.onFinish();

    return step.hasNext;
  },


  /**
   * Run all stepper steps.
   *
   * @param {Number} wait - Milliseconds to wait between step.
   */
  async run(wait=0) {
    let step;
    do {
      // Run the next step
      step = await this.next();

      // Wait for 'wait' milliseconds
      if (wait > 0)
        await new Promise(resolve => setTimeout(resolve, wait));
    }
    while(step);
  }
}
