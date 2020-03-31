import Vue from 'vue';
import GidgetGame from '@/assets/gidget/game/gidget-game';
import GidgetObject from '@/assets/gidget/game/gidget-object';
import { Levels as LevelsEndpoint } from '@/constants/endpoints';

let __game;
if (module.hot && typeof window.__game != 'undefined')
  __game = window.__game;


export const state = () => ({
  key:  0,

  isReady:   false,
  isRunning: false,

  activeStep: 0,
  stepCount:  0,

  selectedObject: undefined,
  selectedTile:   undefined,

  evalData: {},
  initialData: { size: 3, tiles: [], objects: [], dialogue: [], imports: [] },
});


export const mutations = {
  /**
   *
   */
  setRunning(state, value) {
    state.isRunning = value;
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
  reloadGame(state) {
    state.key += 1;
  },

  /**
   *
   */
  setInitialData(state, data) {
    Object.assign(state.initialData, data);
  },

  /**
   *
   */
  setEvalData(state, data) {
    Vue.set(state, 'evalData', data);
  },

  /**
   *
   */
  setWorldSize({}, value) {
    __game.world.size = value;
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
  setSelectedTile(state, value) {
    state.selectedTile = value;
    state.selectedObject = undefined;
  },

  /**
   *
   */
  setSelectedObject(state, value) {
    state.selectedTile = undefined;
    state.selectedObject = value;
  }
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
  createGame({ state, commit }, data) {
    __game = new GidgetGame(data || state.initialData);
    commit('setEvalData', __game.world.getObjectsSanitized());
    commit('reloadGame');

    if (module.hot)
      window.__game = __game;
  },

  /**
   *
   */
  getOrCreateGame({ dispatch }) {
    dispatch('createGame')
  },

  /**
   * Reset the game state and game store.
   *
   * @param {object} state
   * @param {object} commit
   * @return {void}
   */
  resetGame({ commit, getters }) {
    commit('code/resetLines', null, { root: true });
    commit('setActiveStep', 0);
    commit('setStepCount', 0);
    commit('setRunning', false);

    getters['getGame'].reset();
    console.debug('reset');
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
  async setStep({ state, commit }, index) {
    if (!state.isRunning)
      return;

    commit('setActiveStep', index);
    const step = await __game.set(index);

    if (typeof step != 'undefined') {
      commit('code/setActiveLine', step.ln - 1, { root: true });
      if (typeof step.gameData == 'object')
        commit('setEvalData', step.gameData);
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
  async runCode({ commit }, code) {
    const runner = await __game.run(code);

    if (typeof runner.steps == 'object') {
      if (runner.steps.length < 1)
        return false;

      commit('setStepCount', runner.steps.length);
    }

    // Set error line
    if (typeof __game.error == 'object') {
      //
    }

    commit('setRunning', true);
    return runner;
  },

  /**
   * Safely remove game object from object array.
   *
   * @param {object} state
   * @param {number} id
   * @return {boolean}
   */
  removeObject({}, { id }) {
    let index;
    const obj = __game.world.objects.find((obj, i) => {
      const found = obj.id === id;

      if (found)
        index = i;

      return found;
    });

    if (typeof index == 'undefined')
      return false;

    __game.world.removeObject(obj);
    Vue.delete(__game.world.objects, index);
    return true;
  },

  /**
   * Safely add game object to world.
   *
   * @return {void}
   */
  addObject({}, { type, position }) {
    const gameObject = GidgetObject.create({ type, position });
    return __game.world.addObject(gameObject);
  },

  /**
   * Safely update game object properties.
   *
   * @return {void}
   */
  updateObject({}, { object, key, value, defaultValue }) {
    _.setWith(object, key, value, defaultValue, (v, k, o) => Vue.set(o, k, v));
  },

  updateTile({}, {}) {

  }
};


export const getters = {
  /**
   * Retrieve the game instance.
   *
   * @return {object}
   */
  getGame({ key }) {
    key;  // Reactivity
    console.log('ee');
    return __game;
  },

  /**
   * Get size of world.
   *
   * @return {number}
   */
  getWorldSize({}, getters) {
    const game = getters['getGame'];
    return game.world.size;
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
   * @return {any}
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
   * Get a game object based on conditions.
   *
   * @param {function} callback - Conditions for find.
   * @return {object}
   */
  getObject({}, { getGame }) {
    return (callback) => getGame.world.objects.find(callback);
  },

  /**
   * Get a game tile from an x and y coordination.
   *
   * @param {number} x
   * @param {number} y
   * @return {object}
   */
  getTile({}, { getGame }) {
    return ({ x, y }) => getGame.world.tiles.find((tile) => {
      return tile.position.x === x && tile.position.y === y
    });
  },

  /**
   * Get all game objects from game world.
   *
   * @return {array}
   */
  getObjects({}, { getGame }) {
    return getGame.world.objects;
  },

  /**
   * Get all game tiles from game world.
   *
   * @return {array}
   */
  getTiles({}, { getGame }) {
    return getGame.world.tiles;
  },

  /**
   * Find and return the Gidget game object. DO NOT MUTATE.
   *
   * @param {boolean} isReady - If game is ready (from store state).
   * @return {object} - Gidget GameObject if Gidget exists.
   */
  getGidget({}, { getGame }) {
    return () => getGame.world.objects.find((obj) => obj.name === 'Gidget');
  },

  /**
   * Get the selected game object.
   *
   * @return {object}
   */
  getSelectedObject({ selectedObject }, { getGame }) {
    return () => getGame.world.objects.find((obj) => obj.id === selectedObject);
  },

  /**
   * Get the game state directly from the game engine. DO NOT MUTATE.
   *
   * @param {boolean} isReady - If game is ready (from store state).
   * @return {object} Game state if game is ready.
   */
  getWorldState({}, { getGame }) {
    return getGame.world.getState();
  },

};
