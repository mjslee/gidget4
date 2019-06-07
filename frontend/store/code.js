import Vue from 'vue'
import _ from 'lodash'


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

      try {
        let result = _.get(state.objects, value);
        if (result)
          return JSON.stringify(result);

        result = _.get(state.data, value);
        if (result)
          return JSON.stringify(result);

        throw Exception();
      }
      catch {
        return 'unknown';
      }

    };
  }
};
