import Vue from 'vue';
import { LEVELS } from '@/constants/endpoints';


/**
 * State of the `level` store.
 * This is the INITIAL game state created from a level object.
 * Mutating this object will have no effect on the running game.
 *
 * @function state
 * @return object
 */
export const state = () => ({
  title:       '',
  description: '',

  size:     3,
  code:     '',
  tiles:    [],
  objects:  [],
  goals:    [],
  dialogue: [],
  imports:  [] 
});


export const mutations = {
  setSize:     (state, size)     => state.size     = size,
  setCode:     (state, code)     => state.code     = code,
  setTiles:    (state, tiles)    => state.code     = code,
  setObjects:  (state, objects)  => state.objects  = objects,
  setGoals:    (state, goals)    => state.goals    = goals,
  setDialogue: (state, dialogue) => state.dialogue = dialogue,
  setImports:  (state, imports)  => state.imports  = imports,

  /**
   * Load a level object's keys into the state.
   *
   * @param {object} state - Vuex state.
   * @param {object} level - Level object.
   * @return {void}
   */
  load(state, level) {
    if (typeof level != 'object') {
      console.debug('level is not an object.')
      return;
    }

    const set = (field, type) => {
      if (typeof level[field] != type || level[field] == null)
        return;  // field must exist and not be null

      state[field] = level[field];
      console.debug(`level[${field}] has been set.`, state[field]);
    };

    set('size',     'number');
    set('code',     'string');
    set('tiles',    'object');
    set('objects',  'object');
    set('goals',    'object');
    set('dialogue', 'object');
    set('imports',  'object');
  }
};


export const actions = {
  /**
   * Fetch level from API.
   *
   * @param object commit
   * @param object data
   * @return void
   */
  fetch({ commit }, data) {
    if (typeof data != 'object' || typeof data.id == 'undefined') {
      console.debug('`data` is not an object or `data.id` is undefined.');
      return;
    }

    return this.$axios.$get(`${LEVELS}/${data.id}`);
  },
};


export const getters = {
  getValue(state) {
    return value => _.get(state.data, value)
  }
};
