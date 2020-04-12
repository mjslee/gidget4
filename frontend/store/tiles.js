import Vue from 'vue';


export const state = () => ({
  selected: undefined,
});


export const mutations = {
  /*
   * Set the selected tile.
   *
   * @return {void}
   */
  setSelected(state, value) {
    state.selected = value;
  },
};


export const actions = {
  /**
   * Set game tile sprite.
   *
   * @return {void}
   */
  setTile({ rootGetters: { 'game/getWorld': getWorld } }, { position, sprite }) {
    return getWorld.setTile(position, sprite);
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
  getSelected({ selected }, { getTiles }) {
    return selected;
  },
};
