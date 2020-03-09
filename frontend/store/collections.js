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
  
  /**
   * Fetch for a list of level collections.
   */
  fetchCollections({ commit }) {
    return this.$axios.$get(url);
  },

  /**
   * Fetch an individual level collection.
   */
  fetchCollection({ commit }, { id }) {
    return this.$axios.$get(url + id);
  }
};
