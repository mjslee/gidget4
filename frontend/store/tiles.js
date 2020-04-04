import Vue from 'vue';


export const state = () => ({
  selectedTile: undefined
});


export const mutations = {
  /*
   * Set the selected tile.
   *
   * @return {void}
   */
  setSelected(state, value) {
    state.selectedTile = value;
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
   * Get all game tiles from game world.
   *
   * @return {array}
   */
  getTiles({}, {}, {}, { 'game/getWorld': getWorld }) {
    return getWorld.tiles;
  },

  /**
   * Get a game tile from an X and Y coordination.
   *
   * @param {number} x
   * @param {number} y
   * @return {object}
   */
  getTile({}, { getTiles }) {
    return ({ x, y }) => getTiles.find(({ position }) =>
      position.x === x && position.y === y
    );
  },

  /**
   * Get the selected game object.
   *
   * @return {object}
   */
  getSelected({ selectedTile }, { getTiles }) {
    return getTiles.find((tile) => tile.id === selectedTile);
  },
};
