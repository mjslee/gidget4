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

  /*
   * Add a dialogue message to the game world's dialogue array.
   *
   * @return {boolean}
   */
  addGoal({ rootGetters: { 'game/getGame': getGame } }, { assert, args }) {
    if (!getGame)
      return false;

    getGame.addGoal({ assert, args });
    return true;
  },

  /**
   * Remove a goal from game goals by its ID.
   */
  removeGoal({ rootGetters: { 'game/getGame': getGame } }, { id }) {
    if (!getGame)
      return false;

    return getGame.removeGoal(id);
  },

  /**
   * Swap two goals by indexes.
   *
   * @param {number} fromIndex
   * @param {number} toIndex
   * @return {void}
   */
  swapGoal({ getters: { getGoals } }, { fromId, toId }) {
    const fromGoal = getGoals.find((g) => g.id === fromId);
    const toGoal   = getGoals.find((g) => g.id === toId);

    if (!fromGoal || !toGoal)
      return false;

    Vue.set(fromGoal, 'id', toId);
    Vue.set(toGoal,   'id', fromId);
    return true;
  },
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

    return getGame.goals.filter((goal) => !goal.isRemoved);
  },
};
