import _ from 'lodash';
import GidgetWorld from '@/assets/gidget/game/gidget-world';
import Stepper from '@/assets/gidget/lang/js-stepper';
import Explainer from '@/assets/gidget/lang/js-explainer';



export default {
  world: undefined,
  stepper: undefined,
  states: [],

  explainStepIndex: 0,
  explainSteps: [],


  /**
   * Create GidgetGame instance.
   * @param {Object} kwargs - Keyword-arguments to merge into new instance.
   */
  create(kwargs) {
    const game = _.cloneDeep(this);
    game.stepper = Stepper.create();
    game.world = GidgetWorld.create(kwargs);
    return game;
  },


  /**
   * Save game world state.
   */
  save() {
    this.states.push(this.world.getState());
  },


  /**
   * Create game world objects and save the game state.
   * @param {Array[Object]} objects - Objects to create.
   */
  createObjects(objects) {
    objects.forEach(object => this.world.createObject(object));
    this.save();
  },


  /**
   * Add grouped game objects to the imports as their name.
   * @param {Array[Object]} imports - Imports to be merged in on.
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
   */
  reset() {
    // Reset stepper
    this.stepper = _.cloneDeep(Stepper);

    // Restore initial state
    if (this.states.length > 0)
      this.world.restoreState(this.states[0]);
  },


  /**
   * Run script until it hits a breakpoint or ends.
   * @param {String} code - JavaScript code to evaluate.
   * @param {Array[Object]} imports - Game external imports.
   */
  evaluate(code, imports) {
    const result = this.stepper.run(code, this.importsWithObjects(imports));

    // Parsing error, call error callback
    if (result.hasError) {
      console.log(result.error);
      if (typeof this.onError === 'function')
        this.onError(result.error.ln, result.error.message);
      return false;
    }

    // Successful evaluation
    else {
      return true;
    }
  },


  /**
   * Run next step in stepper.
   */
  async step() {
    // Get step
    let step = this.stepper.next();
    if (!step)
      return;

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

    return step.hasNext;
  },


  /**
   * Run all stepper steps.
   * @param {Number} wait - Milliseconds to wait between step.
   */
  async run(wait=50) {
    let step;
    do {
      // Run the next step
      step = await this.step();

      // Wait for 'wait' milliseconds
      if (wait > 0) 
        await new Promise(resolve => setTimeout(resolve, wait));
    }
    while(step);
  },


  async explain() {
    let step;
    do {
      step = this.stepper.next();
      this.stepper.index++;
      const node = this.stepper.injector.flatTree.find(node => {
        return step.range[0] === node.range[0] && step.range[1] === node.range[1];
      });
      Explainer.explainNode(node);
    }
    while(step.hasNext);
  }
}
