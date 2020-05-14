import _             from 'lodash';
import JsStepper     from '@/assets/gidget/lang/js-stepper';
import GidgetWorld   from './gidget-world';
import GidgetImports from './imports';
import GidgetGoal    from './gidget-assert';


export default class GidgetGame {
  /**
   * GidgetGame constructor.
   *
   * @param {number|object[width,height]} size
   * @param {array[object]} tiles
   * @param {array[object]} objects
   * @param {array[object]} dialogue
   * @param {array[object]} goals
   * @param {array[object]} imports
   * @return {GidgetGame}
   */
  constructor({ size, tiles, objects, dialogue, goals, imports }) {
    this.key    = 0;
    this.index  = 0;
    this.states = [];
    this.goals  = [];
    this.imports = JSON.parse(JSON.stringify(imports));

    // Number size must be converted into object
    if (typeof size == 'number')
      size = { width: size, height: size };

    // Create and assign a GidgetWorld object to our game.
    this.world = new GidgetWorld(
      _.cloneDeep({ size, tiles, objects, dialogue })
    );

    // Merge in global imports
    this.import = {};
    if (Array.isArray(imports))
      for (let i = 0, len = imports.length; i < len; i++)
        Object.assign(this.import, _.cloneDeep(GidgetImports[imports[i]]));

    // Add goals
    goals.forEach((goal) => this.addGoal(goal));

    // Set up the javascript stepper, set the onStep callback so the world
    // states can be saved on each step
    this.stepper = new JsStepper({
      onStep: () => this.save()
    });

    // Save initial world state and data so it can be restored on reset
    this.updateInitialState();
    return this;
  }

  /**
   * Resets the game by resetting the stepper and restoring the intial game
   * state.
   *
   * @return {void}
   */
  reset() {
    // Reset code stepper for a clean run
    this.stepper.reset();
    this.error = undefined;

    // Clear states and restore the world to its initial state
    this.states = [];
    return this.set(-1, false);
  }

  /**
   * Saves world state and causes a game tick.
   *
   * @return {void}
   */
  save() {
    this.states.push(this.world.getState());
    this.world.gameTick();
  }

  /**
   * Saves the current state as the new initial game state.
   *
   * @return {void}
   */
  updateInitialState() {
    this.initialState = this.world.getState();
    this.initialData = this.world.getObjectsMap();
  }

  /**
   * Export state of game into a loadable format.
   *
   * @return {number|object[width,height]} size
   * @return {array[object]} tiles
   * @return {array[object]} objects
   * @return {array[object]} dialogue
   * @return {array[object]} goals
   * @return {array[object]} imports
   */
  exportState() {
    // Keys of object to export
    const exportKeys = {
      tiles:    ['type', 'position'],
      dialogue: ['text', 'sprite'],
      goals:    ['assert', 'args'],
      objects:  [ 'type', 'name', 'sprite', 'mixins', 'position', 'energy',
      'layer', 'blocking', 'scale', 'scaleBounds' ]
    };

    // Export data
    const state = this.world.getState();
    return JSON.stringify({
      size:     state.size,
      imports:  this.imports,
      goals:    this.goals.map((g) => _.pick(g, exportKeys['goals'])),
      tiles:    state.tiles.map((t) => _.pick(t, exportKeys['tiles'])),
      objects:  state.objects.map((o) => _.pick(o, exportKeys['objects'])),
      dialogue: state.dialogue.map((d) => _.pick(d, exportKeys['dialogue'])),
    }, null, 2);
  }

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
      this.states[index];

    // Validate state exists
    if (typeof state != 'object')
      return;

    // Determine if step is going in a positive, forward direction
    const isAdvancing = index > this.index;
    this.index = index;

    // Run pre-restore hooks
    if (runHooks && isAdvancing) {
      await this.runHooks(state, hook => hook.when == 'before');

      // Increment update key so any hook callbacks that are running can
      // be cancelled
      this.key += 1;
    }

    // Restore the world state
    this.world.restoreState(state);

    // Run post-restore hooks
    if (runHooks && isAdvancing)
      await this.runHooks(state, (hook) => hook.when == 'after');

    // Get the current step and assign 'gameData' property to store a
    // combination of gameobjects and game data. If 'gameData' is already
    // assigned then skip this to avoid unnecessary processing.
    let step = this.stepper.steps[index - 1];

    if (step && step.data && !step.gameData) {
      const objects = this.world.getObjectsMap(true);
      step.gameData = Object.assign(_.cloneDeep(step.data), objects);
    }

    // If there is no step, we should create a fake step that contains the data
    // for a reset
    if (!step)
      step = { gameData: this.initialData };

    // Return the step for further processing
    return _.cloneDeep(step);
  }

  /**
   * Runs hooks from the a world state depending on conditions.
   *
   * @param {object} state - World state object that contains hooks.
   * @param {conditions} conditions - World state object that contains hooks.
   * @return {boolean} Hooks ran.
   */
  async runHooks(state, conditions) {
    // Ensure we have hooks to run
    if (typeof state.hooks != 'object')
      return false;

    // Filter hooks by specified conditions
    const hooks = state.hooks.filter(conditions);
    if (!hooks.length)
      return false;

    // Store an update key; when another restore happens this key will be
    // incremented but keyCopy will keep the same value. If these two variables
    // are not equal then we know the state has changed we shouldn't run any
    // further hooks from this state
    const keyCopy = this.key;
    const wasInterrupted = () => keyCopy != this.key;

    // Run each callback, if it's a function then collect the results.
    // Hooks callback functions retain their 'this' but are also passed the
    // 'wasInterrupted' function so the hook can determine if it needs to stop.
    const results = [];
    for (let i = 0, len = hooks.length; i < len; i++)
      if (typeof hooks[i].callback == 'function' && !wasInterrupted())
        results.push(await hooks[i].callback.call(null, wasInterrupted));

    // Hook results can be callback functions for cleaning up
    for (let i = 0, len = results.length; i < len; i++)
      if (typeof results[i] == 'function')
        await results[i].call();

    return true;
  }

  /**
   * Returns an object of objects that have been exposed.
   *
   * @param {object} extraImports - Imports to expose.
   * @return {object} Object of game objects.
   */
  getExposedData() {
    // Object to collect imports
    const exposed = {};

    // Merge extra imports into the exposed result
    if (typeof this.import == 'object')
      Object.assign(exposed, this.import);

    // Merge the game objects; game objects are more important than extra
    // imports, so if we have a conflict where a game object and an extra
    // import have the same key then game objects will take precedence.
    const gameObjects = this.world.getObjectsMap(true);
    Object.assign(exposed, gameObjects);

    // Loop over each of the newly merged elements
    for (const prop in exposed) {
      if (!exposed.hasOwnProperty(prop))
        continue;

      // Enclose imported functions in another function with its scope being set
      // to the game world.
      if (typeof exposed[prop] == 'function') {
        const func = exposed[prop];
        exposed[prop] = (...args) => func.call(this.world, ...args);
      }
    }

    // Return the collection
    return exposed;
  }

  /**
   * Runs code.
   *
   * @param {string} code - JavaScript code to evaluate.
   * @return {object} Details of the code evaluation.
   */
  run(code) {
    // Run stepper with the code and the exposed game objects and imports
    const result = this.stepper.run(code, this.getExposedData());

    // Runtime error
    if (typeof result.error == 'object')
      this.error = result.error;

    // Restore first state; this stops the final positions from being
    // revealed (and a potential animation glitch)
    if (result)
      this.set(0, false);

    return result;
  }

  /**
   * Set incremental IDs for all goals.
   * All previous IDs will be overwritten.
   *
   * @return {void}
   */
  enumerateGoals() {
    this.goals.filter((g) => !g.isRemoved).forEach((g, i) => g.id = i);
  }

  /**
   * Add a new gidget goal to the game.
   *
   * @return {void}
   */
  addGoal({ assert, args, complete=undefined, incomplete=undefined }) {
    this.goals.push(new GidgetGoal({ assert, args, complete, incomplete }));
    this.enumerateGoals();
  }

  /**
   * Remove goal from game by its ID.
   *
   * @param {number} id
   * @param {boolean} remove
   * @return {void}
   */
  removeGoal(id, remove=true) {
    const goal = this.goals.find((obj) => obj.id === id);
    if (typeof goal != 'object')
      return false;

    goal.id = -1;
    goal.isRemoved = remove;
    this.enumerateGoals();
    return true;
  }

  /**
   * Run validators on goals.
   * If data is not set, the game's exposed data will be used for validation.
   *
   * @param {object} [data] - (Optional) Game evaluation state.
   * @return {boolean}
   */
  validateGoals(data=undefined) {
    if (!data)
      data = this.getExposedData();

    const goalValues = this.goals.map((goal) => goal.validate(data));
    const success = this.goals.every((goal) => goal.isComplete);

    this.world.runCompletion(success, goalValues);
    return success;
  }

  /**
   * Reset completion statuses of all goals.
   *
   * @return {void}
   */
  resetGoals() {
    this.goals.forEach((goal) => goal.isComplete = undefined);
  }
}
