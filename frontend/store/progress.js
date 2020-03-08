import Vue from 'vue';
import { Levels as url } from '@/constants/endpoints';


export const state = () => ({
  progressId:  undefined,
  levelId:     undefined,
  progressIds: {}
});


export const getters = {
};


export const mutations = {
  setProgressId(state, { levelId, progressId }) {
    state.levelId = levelId;
    state.progressId = progressId;
    Vue.set(state.progressIds, levelId, progressId);
  },
};


export const actions = {
  async fetchProgress({ commit }, { levelId }) {
    const { data } = await this.$axios.$get(`${url}/${levelId}/progress`);
    commit('setProgressId', { levelId, progressId: data.string_id });
  },

  async updateProgress({ state, commit }, { code, data }) {
    return await this.$axios.$post(`${url}/${state.levelId}/progress`, {
      id: state.progressId, code, data
    });
  },

  async fetchCollection({ commit }, { id }) {
    return this.$axios.$get(url + id);
  }
};
