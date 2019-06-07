import Vue from 'vue'


export const state = () => ({
  data: {},
  objects: {}
});


export const mutations = {
  /**
   * Set variable data.
   *
   * @param {object} data
   * @return {void}
   */
  setData(state, data) {
    Vue.set(state, 'data', data);
  },


  /**
   * Set object data.
   *
   * @param {object} objects
   * @return {void}
   */
  setObjects(state, objects) {
    Vue.set(state, 'objects', objects);
  }
};


export const getters = {
  /**
   * Get value of a value or identifier.
   * If value is included in data or objects, return that.
   * Otherwise return the value itself.
   *
   * @param {any} value
   * @return {any}
   */
  getValue(state) {
    return value => {
      const lastIndex = value.length - 1;
      if (value[0] === '\'' && value[lastIndex] === '\'')
        return value.substring(1, lastIndex);

      let result;
      try { result = eval(`state.data.${value}`) } catch (e) { }
      try { result = eval(`state.objects.${value}`) } catch (e) { }

      return JSON.stringify(result || 'unknown');
    };
  }
};
