import Vue from 'vue';
import GidgetObject from '@/assets/gidget/game/gidget-object';


export const state = () => ({
  selected: undefined
});


export const mutations = {
  /*
   * Increment the active index. For next message.
   *
   * @return {void}
   */
  setSelected(state, value) {
    state.selected = value;
  },
};


export const getters = {
  /**
   * Get all game objects from game world.
   *
   * @return {array}
   */
  getObjects({}, {}, {}, { 'game/getWorld': getWorld }) {
    if (!getWorld)
      return [];

    return getWorld.objects.filter((obj) => !obj.isRemoved);
  },

  /**
   * Get a game object based on conditions.
   *
   * @param {function} callback - Conditions for find.
   * @return {object}
   */
  getObject({}, { getObjects }) {
    if (getObjects)
      return (callback) => getObjects.find(callback);
  },

  /**
   * Get the selected game object.
   *
   * @return {object}
   */
  getSelected({ selected }, { getObjects }) {
    if (getObjects)
      return getObjects.find((obj) => obj.id === selected);
  },
};


export const actions = {
  /**
   * Add game object to world.
   *
   * @return {void}
   */
  addObject({ rootGetters: { 'game/getWorld': getWorld } }, gameObj) {
    if (getWorld)
      return getWorld.addObject(gameObj);
  },

  /**
   * Remove game object from object array.
   *
   * @param {object} state
   * @param {number} id
   * @return {boolean}
   */
  removeObject({ rootGetters: { 'game/getWorld': getWorld } }, { id }) {
    if (getWorld)
      return getWorld.removeObject(id);
  },

  /**
   * Swap two goals by IDs.
   *
   * @param {number} fromId
   * @param {number} toId
   * @return {boolean}
   */
  swapObjects({ getters: { getObjects } }, { fromId, toId }) {
    if (!getObjects)
      return false;

    const fromRow = getObjects.find((row) => row.id === fromId);
    const toRow   = getObjects.find((row) => row.id === toId);

    if (!fromRow || !toRow)
      return false;

    Vue.set(fromRow, 'id', toId);
    Vue.set(toRow,   'id', fromId);
    return true;
  },

  /**
   * Setup or re-setup a game object.
   *
   * @param {number} id
   * @param {string} type
   * @param {array[string]} mixins
   * @return {boolean}
   */
  setupObject({ getters: { getObjects } }, { id, type, mixins }) {
    if (!getObjects)
      return false;

    const gameObj = getObjects.find((obj) => obj.id === id);
    if (!gameObj)
      return false;

    gameObj.setup({ type, mixins });
    return true;
  },

  /**
   * Update game object properties.
   *
   * @param {number} id
   * @param {string|array} key
   * @param {any} value
   * @param {any} defaultValue
   * @return {boolean}
   */
  updateObject({ getters: { getObjects } }, { id, key, value, defaultValue }) {
    if (!getObjects)
      return false;

    const gameObj = getObjects.find((obj) => obj.id === id);
    if (!gameObj)
      return false;

    _.setWith(gameObj, key, value, defaultValue, (v, k, o) => Vue.set(o, k, v));
    return true;
  }
};
