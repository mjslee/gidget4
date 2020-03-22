export const state = () => ({
  value: '',

  activeLine:         -1,
  previousActiveLine: -1,
  errorLine:          -1,
  previousErrorLine:  -1,
});


export const mutations = {

  /**
   *
   */
  setValue(state, value) {
    state.value = value;
  },

  /**
   *
   */
  resetLines(state) {
    state.activeLine         = -1;
    state.previousActiveLine = -1;
    state.errorLine          = -1;
    state.previousErrorLine  = -1;
  },

  /**
   *
   */
  setActiveLine(state, ln) {
    state.previousActiveLine = state.activeLine;
    state.activeLine = ln;
  },

  /**
   *
   */
  setErrorLine(state, ln) {
    state.previousErrorLine = state.errorLine;
    state.errorLine = ln;
  },

};
