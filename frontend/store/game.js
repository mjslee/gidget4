import _ from 'lodash';
import Vue from 'vue';
import { Levels as LevelsEndpoint } from '@/constants/endpoints';

import GidgetGame from '@/assets/gidget/game/gidget-game';
let __gameState;

/**
 * State of the `level` store.
 * This is the INITIAL game state created from a level object.
 * Mutating this object will have no effect on the running game.
 *
 * @function state
 * @return object
 */
export const state = () => ({
  gameState: () => __gameState,

  key:  0,
  code: '',
  
  isReady:   false,
  isRunning: false,

  activeLine:         -1,
  previousActiveLine: -1,
  errorLine:          -1,
  previousErrorLine:  -1,

  activeStep: 0,
  stepCount:  0,

  goals: [],
  evalData: {},

  initialData: {
    size: 3,
    tiles:    [],
    objects:  [],
    goals:    [],
    dialogue: [],
    imports:  []
  },
});


export const mutations = {
  /**
   * Load a level object's keys into the state.
   *
   * @param {object} state - Vuex state.
   * @param {object} level - Level object.
   * @return {void}
   */
  load(state, data) {
    Object.assign(state.initialData, data);
    state.code = data.code;
    state.key += 1;
    Vue.set(state, 'goals', _.cloneDeep(data.goals));
    console.debug("Level Loaded:", data, state.key);
  },

  /**
   * Reload game by updating the key to update attached components.
   *
   * @param {object} state
   * @return {void}
   */
  reload(state) {
    state.key += 1;
  },

  /**
   *
   */
  setData(state, data) {
    Vue.set(state, 'evalData', data);
  },

  /**
   *
   */
  setWorldSize(state, value) {
    __gameState.world.size = value;
  },

  /**
   *
   */
  setCode(state, value) {
    state.code = value;
  },

  /**
   *
   */
  setReady(state, value) {
    state.isReady = value;
  },

  /**
   *
   */
  setRunning(state, value) {
    state.isRunning = value;
  },

  /**
   *
   */
  resetLines(state) {
    state.activeLine         = -1;
    state.previousActiveLine = -1;
    state.errorLine          = -1;
    state.previousErrorLine  = -1;
  },

  /**
   *
   */
  resetSteps(state) {
    state.activeStep = 0;
    state.stepCount  = 0;
  },

  /**
   *
   */
  setActiveLine(state, ln) {
    state.previousActiveLine = state.activeLine;
    state.activeLine = ln;
  },

  /**
   *
   */
  setErrorLine(state, ln) {
    state.previousErrorLine = state.errorLine;
    state.errorLine = ln;
  },

  /**
   *
   */
  setActiveStep(state, index) {
    if (state.activeStep > state.stepCount)
      state.activeStep = state.stepCount;

    state.activeStep = index;
  },

  /**
   *
   */
  setStepCount(state, value) {
    state.stepCount = value;
  },

  /**
   *
   */
  setGoalStatus(state, { goal, status }) {
    Vue.set(goal, 'isComplete', status);
  },
};


export const actions = {
  /**
   * Fetch level from API.
   *
   * @param object commit
   * @param object data
   * @return object|void
   */
  async fetchLevel({ commit }, { id }) {
    if (typeof id == 'undefined') {
      console.debug('`data` is not an object or `data.id` is undefined.');
      return;
    }

    const level = await this.$axios.$get(`${LevelsEndpoint}/${id}`);
    return typeof level == 'object' ? level.data : null;
  },

  /**
   * Fetch level from API and load it.
   *
   * @async
   * @param {object} commit
   * @param {object} dispatch
   * @param {number|string} id
   * @return {void}
   */
  async fetchAndLoad({ commit, dispatch }, { id }) {
    const data = await dispatch('fetchLevel', { id });
    commit('load', data);
  },


  /**
   * Create game object and set up initial data in store.
   *
   * @param {object} state
   * @param {object} commit
   * @return {void}
   */
  createGame({ state, commit }) {
    __gameState = GidgetGame.create(state.initialData);
    commit('setReady', true);
    commit('setRunning', false);
    commit('setData', __gameState.world.getObjectsSanitized());
  },

  /**
   * Reset the game state and game store.
   *
   * @param {object} state
   * @param {object} commit
   * @return {void}
   */
  resetGame({ state, commit }) {
    commit('setRunning', false);
    commit('resetLines');
    commit('resetSteps');
    //commit('resetGoals');

    if (typeof __gameState != 'undefined' && state.isReady)
      __gameState.reset();
  },

  /**
   * Restore a previous game state by its index.
   *
   * @async
   * @param {object} state
   * @param {object} commit
   * @param {number} index - Index of saved game state to restore.
   * @return {void}
   */
  async setStepState({ state, commit }, index) {
    if (!state.isReady || !state.isRunning)
      return;

    commit('setActiveStep', index);
    const step = await __gameState.set(index);

    if (typeof step != 'undefined') {
      commit('setActiveLine', step.ln - 1);
      if (typeof step.gameData == 'object')
        commit('setData', step.gameData);
    }

    return step;
  },

  /**
   * Evaluate player's code and update store with results.
   *
   * @async
   * @param {object} state
   * @param {object} commit
   * @param {string} code - Code to be evaluated.
   * @return {void}
   */
  async runCode({ state, commit }, code) {
    if (!state.isReady || state.isRunning)
      return;

    const runner = await __gameState.run(code || state.code);

    if (typeof runner.steps == 'object') {
      if (runner.steps.length < 1)
        return false;

      commit('setRunning', true);
      commit('setStepCount', runner.steps.length);
    }

    // Set error line 
    if (typeof __gameState.error == 'object') {
      //
    }

    return runner;
  },

  /**
   * Set all goals to incomplete.
   *
   * @return {void}
   */
  resetGoals({}) {
    state.goals.forEach((goal) => {
      Vue.set(goal, 'isComplete', undefined);
    });
  },

  /**
   * Test if goals were all successfully completed.
   *
   * @param {object} state
   * @param {object} commit
   * @param {object} dispatch
   * @return {void}
   */
  validateGoals({ state, commit, dispatch }) {
    state.goals.forEach((goal) => {
      commit('setGoalStatus', { goal, status: dispatch('assertGoal', goal) });
    });
  },

  /**
   * Assert a goal is completed.
   *
   * @param {object} getters
   * @param {array} assertion
   * @return {void}
   */
  assertGoal({ getters }, assertion) {
    switch (assertion.assert) {
        // Equality assertion
      case 'equal':
        const a = getters['getValue'](assertion.arguments[0]);
        const b = getters['getValue'](assertion.arguments[1]);
        console.debug(assertion, a, b);
        return a == b;

        // Default assertion
      default:
        return false;
    }
  },

  /**
   * Safely update game object properties.
   *
   * @return {void}
   */
  updateObject(state, { object, key, value, defaultValue }) {
    _.setWith(object, key, value, defaultValue, (v, k, o) => Vue.set(o, k, v));
  },
};


export const getters = {
  /**
   * Test if stepper has a next step.
   *
   * @param {number} activeStep - Current active step index.
   * @param {number} stepCount - Amount of steps in the stepper.
   * @return {boolean} Is there a next step in the stepper?
   */
  hasNextStep({ activeStep, stepCount }) {
    return stepCount == 0 || activeStep < stepCount;
  },

  /**
   * Test if stepper has a previous step.
   *
   * @param {number} activeStep - Current active step index.
   * @return {boolean} Is there a previous step in the stepper?
   */
  hasPreviousStep({ activeStep }) {
    return activeStep > 0;
  },

  /**
   * 
   *
   * @param {number} activeStep - Index of the active step.
   * @param {number} stepCount - Total amount of steps in the stepper.
   * @return {boolean} Test if stepper has finished stepping all steps.
   */
  isEvalComplete({ activeStep, stepCount }) {
    return stepCount != 0 && activeStep >= stepCount;
  },

  /**
   * Get value of a symbol from the evaluated result.
   *
   * @param {string} key - Key of eval data object.
   * @param {any} defaultValue - Default value if data does not have the key.
   * @return any
   */
  getValue({ data }) {
    return (key, defaultValue=undefined) => {
      const value = _.get(data, key);

      if (typeof defaultValue == 'undefined')
        return value;

      return typeof value == 'undefined' ? (defaultValue || key) : value;
    }
  },

  /**
   * Get size of world.
   *
   * @return {number}
   */
  getWorldSize() {
    return __gameState.world.size;
  },

  /**
   * Find and return the Gidget game object. DO NOT MUTATE.
   *
   * @param {boolean} isReady - If game is ready (from store state).
   * @return {object} - Gidget GameObject if Gidget exists.
   */
  getGidget({ isReady }) {
    return () => {
      if (!isReady)
        return;

      return __gameState.world.objects.find(obj => obj.name === 'Gidget');
    };
  },

  /**
   * Get the game state directly from the game engine. DO NOT MUTATE.
   *
   * @param {boolean} isReady - If game is ready (from store state).
   * @return {object} Game state if game is ready.
   */
  getState({ isReady }) {
    if (!isReady)
      return;

    return __gameState.world.getState();
  },
  
};
