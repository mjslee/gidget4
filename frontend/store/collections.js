import { Collections as url } from '@/constants/endpoints';


export const state = () => {
  //
};


export const getters = {
  //
};


export const mutations = {
  //
};


export const actions = {
  fetchCollections({ commit }) {
    return this.$axios.$get(url);
  },

  async fetchCollection({ commit }, { id }) {
    return this.$axios.$get(url + id);
  }
};
