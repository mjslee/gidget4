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


export const getters = {
  /*
   * Get dialogue from the game world in "game" store.
   *
   * @return {array}
   */
  getDialogue({}, {}, {}, { 'game/getWorld': getWorld }) {
    if (!getWorld)
      return [];

    return getWorld.dialogue.filter((obj) => !obj.isRemoved);
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
  addDialogue({ rootGetters: { 'game/getWorld': getWorld } }, dialogue) {
    if (!getWorld)
      return false;

    getWorld.addDialogue(dialogue);
    return true;
  },

  /**
   * Remove a dialogue object by its ID.
   *
   * @param {number} id
   * @return {boolean}
   */
  removeDialogue({ rootGetters: { 'game/getWorld': getWorld } }, { id }) {
    return getWorld.removeDialogue(id);
  },

  /**
   * Swap two dialogue messages by IDs.
   *
   * @param {number} fromId
   * @param {number} toId
   * @return {void}
   */
  swapDialogue({ getters: { getDialogue } }, { fromId, toId }) {
    const fromRow = getDialogue.find((row) => row.id === fromId);
    const toRow   = getDialogue.find((row) => row.id === toId);

    if (!fromRow || !toRow)
      return false;

    Vue.set(fromRow, 'id', toId);
    Vue.set(toRow,   'id', fromId);
    return true;
  },
};
