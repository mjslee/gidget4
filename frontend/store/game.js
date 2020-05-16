import _ from 'lodash';
import Vue from 'vue';
import GidgetGame from '@/assets/gidget/game/gidget-game';
import { Levels as LevelsEndpoint } from '@/constants/endpoints';

let __game;
if (module.hot && typeof window.__game != 'undefined')
  __game = window.__game;


export const state = () => ({
  key: 0,

  isComplete : false,
  isRunning  : false,
  activeStep : 0,
  stepCount  : 0,

  evalData    : {},
  docsData    : {},
  exposedData : {},
  initialData : {
    size     : 3,
    tiles    : [],
    objects  : [],
    dialogue : [],
    imports  : [],
    goals    : []
  },
});


export const mutations = {
  /**
   * Set isRunning state value.
   *
   * @param {boolean} value
   * @return {void}
   */
  setRunning(state, value) {
    state.isRunning = value;
  },

  /**
   * Set isComplete state value.
   *
   * @param {boolean} value
   * @return {void}
   */
  setComplete(state, value) {
    state.isComplete = value;
  },

  /**
   * Reload game by updating the key, forcing a component refresh.
   *
   * @return {void}
   */
  reloadGame(state) {
    state.key += 1;
  },

  /**
   * Set the initial game data.
   *
   * @return {object} data
   * @return {void}
   */
  setInitialData(state, data) {
    Object.assign(state.initialData, data);
  },

  /**
   * Set evaluation data from stepper.
   *
   * @return {object} data
   * @return {void}
   */
  setEvalData(state, data) {
    Vue.set(state, 'evalData', data);
  },

  /**
   * Set documentation data from stepper.
   *
   * @return {object} data
   * @return {void}
   */
  setDocsData(state, data) {
    Vue.set(state, 'docsData', data);
  },

  /**
   * Update size of world.
   *
   * @param {value}
   * @return {void}
   */
  setWorldSize({}, value) {
    Vue.set(__game.world, 'size', value);
    __game.world.forceInBounds();
  },

  /**
   * Set active step number.
   *
   * @param {number} index - Index of step to set active.
   * @return {void}
   */
  setActiveStep(state, index) {
    if (state.activeStep > state.stepCount)
      state.activeStep = state.stepCount;

    state.activeStep = index;
  },

  /**
   * Set total number of steps in stepper.
   *
   * @param {number} value
   * @return {void}
   */
  setStepCount(state, value) {
    state.stepCount = value;
  },
};


export const actions = {
  /**
   * Fetch level from API.
   *
   * @param {object} commit
   * @param {object} data
   * @return {void|object}
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
   * Load a level object's keys into the state.
   *
   * @param {object} state - Vuex state.
   * @param {object} data - Level data.
   * @return {void}
   */
  loadLevel({ state, commit, dispatch }, data) {
    commit('setInitialData', data);
    commit('code/setValue', data.code, { root: true });
    dispatch('createGame');
    console.debug('Level Loaded:', data, state.key);
  },

  /**
   * Create game object and set up initial data in store.
   *
   * @param {object} state
   * @param {object} commit
   * @return {void}
   */
  createGame({ state, commit }, gameData) {
    __game = Vue.observable(new GidgetGame(gameData || state.initialData));
    const { data, docs } = __game.getExposed();
    commit('setEvalData', data);
    commit('setDocsData', docs);
    commit('reloadGame');

    if (module.hot)
      window.__game = __game;
  },
  
  /**
   * [TODO:description]
   *
   * @return {[TODO:type]} [TODO:description]
   */
  updateGame({ commit, getters: { getGame } }) {
    if (!getGame)
      return;

    getGame.updateInitialState();
    getGame.reset();
  },

  /**
   * Reset the game state and game store.
   *
   * @return {void}
   */
  resetGame({ commit, dispatch, getters: { getGame } }) {
    commit('setRunning', false);
    commit('setComplete', false);
    commit('setActiveStep', 0);
    commit('setStepCount', 0);

    const root = { root: true };

    commit('code/resetLines', null, root);
    commit('dialogue/reset', null, root);
    dispatch('goals/resetGoals', null, root);

    if (getGame)
      getGame.reset();
  },

  /**
   * Restore a previous game state by its index.
   *
   * @async
   * @param {object} state
   * @param {object} commit
   * @param {number} index - Index of saved game state to restore.
   * @param {number} relative - Index of saved game state to restore.
   * @return {object}
   */
  async setStep({ state, commit, dispatch }, { index, relative }) {
    if (!state.isRunning)
      return;

    if (typeof relative == 'number')
      index = state.activeStep + relative;

    commit('setActiveStep', index);
    const step = await __game.set(index);

    // No step means we're at the last step. So run completion.
    if (typeof step == 'undefined')
      return dispatch('runCompletion');

    commit('code/setActiveLine', step.ln - 1, { root: true });

    if (typeof step.data == 'object')
      commit('setEvalData', step.data);

    if (typeof step.docs == 'object')
      commit('setDocsData', step.docs);

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
  async runCode({ commit, dispatch }, code) {
    dispatch('resetGame');
    const runner = await __game.run(code);

    if (typeof runner.steps == 'object') {
      if (runner.steps.length < 1)
        return false;

      commit('setStepCount', runner.steps.length);
    }

    // Set error line
    if (typeof __game.error == 'object')
      commit('code/setErrorLine', __game.error.ln - 1, { root: true });

    commit('setRunning', true);
    return runner;
  },

  /**
   * [TODO:description]
   *
   * @param {[TODO:type]} commit - [TODO:description]
   * @param {[TODO:type]} dispatch - [TODO:description]
   * @return {[TODO:type]} [TODO:description]
   */
  async runCompletion({ state, commit, dispatch, getters: { getGame } }) {
    // No need to run completions twice.
    if (state.isComplete || !getGame)
      return;

    commit('setComplete', true);
    getGame.validateGoals();
  }
};


export const getters = {
  /**
   * Get the game instance.
   *
   * @return {object}
   */
  getGame({ key }) {
    return __game;
  },

  /*
   * Get game world instance.
   *
   * @return {object}
   */
  getWorld({}, { getGame }) {
    if (getGame)
      return getGame.world;
  },

  /**
   * Get the game world state.
   *
   * @return {object}
   */
  getWorldState({}, { getWorld }) {
    if (getWorld)
      return getWorld.getState();
  },

  /**
   * Get size of world.
   *
   * @return {number}
   */
  getWorldSize({}, { getWorld }) {
    if (getWorld)
      return getWorld.size;
  },

  /**
   * Determine if stepper evaluation is complete.
   *
   * @param {number} activeStep - Index of the active step.
   * @param {number} stepCount - Total amount of steps in the stepper.
   * @return {boolean} Test if stepper has finished stepping all steps.
   */
  isEvaluating({ activeStep, stepCount }) {
    return stepCount != 0 && activeStep < stepCount;
  },

  /**
   * Get value of a symbol from the evaluated result.
   *
   * @param {string} key - Key of eval data object.
   * @param {any} defaultValue - Default value if data does not have the key.
   * @return {any}
   */
  getValue({ exposedData }) {
    return (key, defaultValue=undefined) => {
      const value = _.get(exposedData, key);

      if (typeof defaultValue == 'undefined')
        return value;

      return typeof value == 'undefined' ? (defaultValue || key) : value;
    }
  },
};
