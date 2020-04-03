import Vue from 'vue';


/**
 * Swap two array elements in place by two indexes.
 * Uses Vue.set() for Vue reactivity.
 *
 * @param {array} arr
 * @param {number} fromIndex
 * @param {number} toIndex
 * @return {void|object} Returns found objects as { from, to }.
 */
export const swapElements = (arr, fromIndex, toIndex) => {
  const length = arr.length;
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= length || toIndex >= length)
    return;

  const from = arr[fromIndex];
  const to   = arr[toIndex];

  Vue.set(arr, fromIndex, to);
  Vue.set(arr, toIndex, from);

  return { from, to };
};
