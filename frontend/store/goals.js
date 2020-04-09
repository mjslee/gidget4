import Vue from 'vue';


export const state = () => ({
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


export const getters = {
  /*
   * Get dialogue from the game world in "game" store.
   *
   * @return {array}
   */
  getGoals({}, {}, {}, { 'game/getGame': getGame }) {
    return getGame.goals.filter((goal) => !goal.isRemoved);
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
  },

  /*
   * Add a dialogue message to the game world's dialogue array.
   *
   * @return {boolean}
   */
  addGoal({ rootGetters: { 'game/getGame': getGame } }, goal) {
    if (!getGame)
      return false;

    getGame.addGoal(goal);
    return true;
  },

  /**
   * Remove a goal from game goals by its ID.
   *
   * @param {number} id
   * @return {boolean}
   */
  removeGoal({ rootGetters: { 'game/getGame': getGame } }, { id }) {
    if (!getGame)
      return false;

    return getGame.removeGoal(id);
  },

  /**
   * Swap two goals by IDs.
   *
   * @param {number} fromId
   * @param {number} toId
   * @return {void}
   */
  swapGoal({ getters: { getGoals } }, { fromId, toId }) {
    const fromRow = getGoals.find((row) => row.id === fromId);
    const toRow   = getGoals.find((row) => row.id === toId);

    if (!fromRow || !toRow)
      return false;

    Vue.set(fromRow, 'id', toId);
    Vue.set(toRow,   'id', fromId);
    return true;
  },
};
