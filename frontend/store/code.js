export const state = () => ({
  value: `Gidget.goto(Kitten);
Gidget.grab(Kitten);
Gidget.goto(Dog);
Gidget.left();
Gidget.drop(Kitten);
Gidget.right(2);`,

  activeLine : -1,
  errorLine  : -1,
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
    state.activeLine = -1;
    state.errorLine  = -1;
  },

  /**
   *
   */
  setActiveLine(state, ln) {
    state.activeLine = ln;
  },

  /**
   *
   */
  setErrorLine(state, ln) {
    state.errorLine = ln;
  },
};
