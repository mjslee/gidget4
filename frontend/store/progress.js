import Vue from 'vue';
import { Levels as url } from '@/constants/endpoints';


export const state = () => ({
  levelId:     undefined,
  progressIds: {}
});


export const getters = {
  /**
   * Get the session's progress ID by the level ID.
   *
   * @param {[TODO:type]} state - [TODO:description]
   * @return {[TODO:type]} [TODO:description]
   */
  getProgressId(state) {
    return state.progressIds[`level-${state.levelId}`];
  }
};


export const mutations = {
  /**
   *
   */
  setLevelProgressId(state, { levelId, progressId }) {
    Vue.set(state, 'levelId', levelId);
    Vue.set(state.progressIds, `level-${levelId}`, progressId);
  },
};


export const actions = {
  /**
   *
   */
  async fetchProgress({ commit }, { levelId }) {
    const { data } = await this.$axios.$get(`${url}/${levelId}/progress`);
    commit('setLevelProgressId', { levelId, progressId: data.id });
  },

  /**
   *
   */
  updateProgress({ state, commit }, { code, data }) {
    this.$axios.$post(`${url}/${state.levelId}/progress`, {
      id: state.progressId, code, data
    });
  },

  /**
   *
   */
  async fetchCollection({ commit }, { id }) {
    return this.$axios.$get(url + id);
  }
};
