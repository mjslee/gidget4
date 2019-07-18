import Vue from 'vue'


export const state = () => {
  data: { }
}


export const mutations = {
  setData(state, data) {
    Vue.set(state, 'data', data)
  }
}


export const getters = {
  getValue(state) {
    return value => _.get(state.data, value)
  }
}
