import Vue from 'vue';
import { swapElements } from '@/helpers/array';


export const state = () => ({
  goals: [],
  activeIndex: 0
});


export const mutations = {
  /*
   * Increment the active index. For next message.
   *
   * @return {void}
   */
  complete(state) {
    state.activeIndex += 1;
  },
};


export const actions = {
  /*
   * Add a dialogue message to the game world's dialogue array.
   *
   * @return {boolean}
   */
  addDialogue({ rootGetters: { 'game/getWorld': getWorld } }, dialogue) {
    if (!getWorld)
      return false;

    getWorld.addDialogue(dialogue);
    return true;
  },

  removeDialogue({ getters: { getDialogue } }, { id }) {
    const index = getDialogue.findIndex((dialogue) => dialogue.id === id);
    Vue.delete(getDialogue, index);
  },

  /**
   * Swap two dialogue messages by indexes.
   *
   * @param {number} fromIndex
   * @param {number} toIndex
   * @return {void}
   */
  swapDialogue({ getters: { getDialogue } }, { fromIndex, toIndex }) {
    const rows = swapElements(getDialogue, fromIndex, toIndex);
    if (rows)
      [rows.from.id, rows.to.id] = [rows.to.id, rows.from.id];
  },

  /*
   * Set next message.
   *
   * @return {void}
   */
  next({ getters: { hasNext }, commit }) {
    if (hasNext)
      commit('increment');
  },

  /*
   * Set previous message.
   *
   * @return {void}
   */
  previous({ getters: { hasPrevious }, commit }) {
    if (hasPrevious)
      commit('decrement');
  }
};


export const getters = {
  /*
   * Get dialogue from the game world in "game" store.
   *
   * @return {array}
   */
  getGoals({}, {}, {}, { 'game/getGame': getGame }) {
    if (!getGame)
      return [];

    return getGame.goals;
  },
};
