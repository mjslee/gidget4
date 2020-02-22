import Vue from 'vue';
import { LEVELS } from '@/constants/endpoints';


/**
 * State of the `level` store.
 * This is the INITIAL game state created from a level object.
 * Mutating this object will have no effect on the running game.
 *
 * @function state
 * @return object
 */
export const state = () => ({
  title:       '',
  description: '',

  key:  0,
  code: '',

  initialData: {
    size: 3,
    tiles:    [],
    objects:  [],
    goals:    [],
    dialogue: [],
    imports:  []
  }
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
    console.debug("Level Loaded:", data, state.key);
    state.key += 1;
  },

  /**
   * Reload game by updating the key to update attached components.
   *
   * @param {object} state
   * @return {void}
   */
  reload(state) {
    state.key += 1;
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
  async fetch({ commit }, { id }) {
    if (typeof id == 'undefined') {
      console.debug('`data` is not an object or `data.id` is undefined.');
      return;
    }

    const level = await this.$axios.$get(`${LEVELS}/${id}`);
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
    const data = await dispatch('fetch', { id });
    commit('load', data);
  },
};


export const getters = { };
