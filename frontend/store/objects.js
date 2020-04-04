import Vue from 'vue';
import GidgetObject from '@/assets/gidget/game/gidget-object';


export const state = () => ({
  selectedObject: undefined
});


export const mutations = {
  /*
   * Increment the active index. For next message.
   *
   * @return {void}
   */
  setSelected(state, value) {
    state.selectedObject = value;
  },
};


export const actions = {
  /**
   * Add game object to world.
   *
   * @return {void}
   */
  addObject({ rootGetters: { 'game/getWorld': getWorld } }, { type, position }) {
    const gameObject = GidgetObject.create({ type, position });
    return getWorld.addObject(gameObject);
  },

  /**
   * Remove game object from object array.
   *
   * @param {object} state
   * @param {number} id
   * @return {boolean}
   */
  removeObject({ rootGetters: { 'game/getWorld': getWorld } }, { id }) {
    let index;
    const obj = getWorld.objects.find((obj, i) => {
      const found = obj.id === id;

      if (found)
        index = i;

      return found;
    });

    if (typeof index == 'undefined')
      return false;

    getWorld.removeObject(obj);
    Vue.delete(getWorld.objects, index);
    return true;
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


export const getters = {
  /**
   * Get all game objects from game world.
   *
   * @return {array}
   */
  getObjects({}, {}, {}, { 'game/getWorld': getWorld }) {
    return getWorld.objects;
  },

  /**
   * Get a game object based on conditions.
   *
   * @param {function} callback - Conditions for find.
   * @return {object}
   */
  getObject({}, {}, {}, { 'game/getWorld': getWorld }) {
    return (callback) => getWorld.objects.find(callback);
  },

  /**
   * Get the selected game object.
   *
   * @return {object}
   */
  getSelected({ selectedObject }, {}, {}, { 'game/getWorld': getWorld }) {
    return getWorld.objects.find((obj) => obj.id === selectedObject);
  },
};
