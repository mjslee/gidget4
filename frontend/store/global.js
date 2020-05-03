export const state = () => ({
  popoverId: -1,
});


export const mutations = {
  /**
   * Set ID of popover.
   */
  setPopoverId(state, value) {
    state.popoverId = value;
  },
};
