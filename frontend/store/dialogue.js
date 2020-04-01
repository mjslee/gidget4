export const state = () => ({
  activeIndex: 0
});


export const mutations = {
  /*
   * Increment the active index. For next message.
   *
   * @return {void}
   */
  increment(state) {
    state.activeIndex += 1;
  },

  /*
   * Decrement the active index. For previous message.
   *
   * @return {void}
   */
  decrement(state) {
    state.activeIndex -= 1;
  }
};


export const actions = {
  /*
   * Add a dialogue message to the game world's dialogue array.
   *
   * @return {boolean}
   */
  addDialogue({}, {}, {}, { 'game/getWorld': getWorld }) {
    return false;
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
  getDialogue({}, {}, {}, { 'game/getWorld': getWorld }) {
    return getWorld.dialogue;
  },

  /**
   * Get the active dialogue message. If none exist return undefined.
   *
   * @return {object}
   */
  getActiveDialogue({ activeIndex }, { getDialogue }) {
    if (!getDialogue)
      return;

    if (!Array.isArray(getDialogue))
      return;

    return getDialogue[activeIndex];
  },

  /*
   * Get length of dialogue messages array.
   *
   * @return {number}
   */
  getLength({}, { getDialogue }) {
    if (!getDialogue)
      return 0;

    return getDialogue.length - 1;
  },

  /*
   * Does a next dialogue message exist?
   *
   * @return {boolean}
   */
  hasNext({ activeIndex }, { getLength }) {
    return activeIndex < getLength;
  },

  /*
   * Does a previous dialogue message exist?
   *
   * @return {boolean}
   */
  hasPrevious({ activeIndex }) {
    return activeIndex > 0;
  }
};
