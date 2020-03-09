import _ from 'lodash';
import Vue from 'vue';
import Game from '@/assets/gidget/game/gidget-game';
import { Levels as LevelsEndpoint } from '@/constants/endpoints';

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
  
  isReady:   false,
  isRunning: false,
  key:     0,
  code:    '',

  activeLine:         -1,
  previousActiveLine: -1,
  errorLine:          -1,
  previousErrorLine:  -1,

  activeStep: 0,
  stepCount:  0,

  activity: {
    activeSeconds:   0,
    inactiveSeconds: 0,
    codeSeconds:     0,
    popupSeconds:    0,

    validations: 0,
    arrowKeys:   0,
  },

  initialData: {
    size: 3,
    tiles:    [],
    objects:  [],
    goals:    [],
    dialogue: [],
    imports:  []
  },

  goals: [],
  evalData: {},
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
   *
   */
  createGame({ state, commit }) {
    __gameState = Game.create(state.initialData);
    commit('setReady', true);
    commit('setRunning', false);
    commit('setData', __gameState.world.getObjectsSanitized());
  },

  /**
   *
   */
  resetGame({ state, commit }) {
    commit('setRunning', false);
    commit('resetLines');
    commit('resetSteps');
    //commit('resetGoals');

    if (state.isReady)
      return __gameState.reset();
  },

  /**
   *
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
   * 
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
   *
   */
  resetGoals({}) {
    state.goals.forEach((goal) => {
      Vue.set(goal, 'isComplete', undefined);
    });
  },

  /**
   *
   */
  validateGoals({ state, commit, dispatch }) {
    state.goals.forEach((goal) => {
      commit('setGoalStatus', { goal, status: dispatch('assertGoal', goal) });
    });
  },

  /**
   *
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
  }
};


export const getters = {
  /**
   *
   */
  hasNextStep({ activeStep, stepCount }) {
    return stepCount == 0 || activeStep < stepCount;
  },

  /**
   *
   */
  hasPreviousStep({ activeStep }) {
    return activeStep > 0;
  },

  /**
   *
   */
  isComplete({ activeStep, stepCount }) {
    return stepCount != 0 && activeStep >= stepCount;
  },

  /**
   * Get 
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
   * [TODO:description]
   *
   * @return {[TODO:type]} [TODO:description]
   */
  getGidget({ isReady }) {
    return () => {
      if (!isReady)
        return;

      return __gameState.world.objects.find(obj => obj.name === 'Gidget');
    };
  },

  /**
   * [TODO:description]
   *
   * @return {[TODO:type]} [TODO:description]
   */
  getState({ isReady }) {
    if (!isReady)
      return;

    return __gameState.world.getState();
  },
  
};
