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
    return getWorld.objects.filter((obj) => !obj.isRemoved);
  },

  /**
   * Get a game object based on conditions.
   *
   * @param {function} callback - Conditions for find.
   * @return {object}
   */
  getObject({}, { getObjects }) {
    return (callback) => getObjects.find(callback);
  },

  /**
   * Get the selected game object.
   *
   * @return {object}
   */
  getSelected({ selected }, { getObjects }) {
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
    return getWorld.removeObject(id);
  },

  /**
   * Update game object properties.
   *
   * @return {void}
   */
  updateObject({}, { object, key, value, defaultValue }) {
    _.setWith(object, key, value, defaultValue, (v, k, o) => Vue.set(o, k, v));
  },
};
