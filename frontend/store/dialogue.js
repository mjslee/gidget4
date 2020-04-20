import Vue from 'vue';


export const state = () => ({
  activeIndex: 0,
  addonDialogue: [],
});


export const mutations = {
  /**
   * Set the active index.
   *
   * @param {number} value
   * @return {void}
   */
  setIndex(state, value) {
    state.activeIndex = value;
  },

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
  },

  /**
   * Add addon dialogue.
   *
   * @param {object} dialogue - Dialogue object.
   */
  addon(state, dialogue) {
    state.addonDialogue.push(dialogue);
  },

  /**
   * Reset addon dialogue.
   *
   * @return {void}
   */
  reset(state) {
    state.setIndex = 0;
    Vue.set(state, 'addonDialogue', []);
  }
};


export const getters = {
  /*
   * Get dialogue from the game world in "game" store.
   *
   * @return {array}
   */
  getDialogue({ addonDialogue }, {}, {}, { 'game/getWorld': getWorld }) {
    if (!getWorld)
      return [];

    return getWorld.dialogue.filter((obj) => !obj.isRemoved);
  },

  /**
   * Get the active dialogue message. If none exist return undefined.
   *
   * @return {object}
   */
  getActiveDialogue({ activeIndex, addonDialogue }, { getDialogue }) {
    if (!(getDialogue && Array.isArray(getDialogue)))
      return;

    // Get world dialogue when index is within dialogue length.
    const dialogueLength = getDialogue.length;
    if (activeIndex < getDialogue.length)
      return getDialogue[activeIndex];

    // But when the index is greater than the amount of world dialogue,
    // we'll attempt to fetch from the addon dialogue.
    const newActiveIndex = activeIndex - dialogueLength;
    if (newActiveIndex < addonDialogue.length)
      return addonDialogue[newActiveIndex];
  },

  /*
   * Get length of dialogue messages array.
   *
   * @return {number}
   */
  getLength({ addonDialogue }, { getDialogue }) {
    if (!getDialogue)
      return 0;

    return getDialogue.length + addonDialogue.length - 1;
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
  /**
   * Reset all game goals.
   *
   * @return {void}
   */
  resetDialogue({ rootGetters: { 'game/getGame': getGame } }) {
    if (getGame)
      getGame.resetGoals();
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
  },

  /*
   * Add a dialogue message to the game world's dialogue array.
   *
   * @return {boolean}
   */
  addDialogue({ commit, rootGetters: { 'game/getWorld': getWorld } }, dialogue) {
    if (!getWorld)
      return false;

    if (dialogue.addon === true) {
      commit('addon', dialogue);
      return true;
    }

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
