import _ from 'lodash';
import Vue from 'vue';


export default {
  data() {
    return {
      canReset: false,
      canComplete: false,
      updateKeys: []
    }
  },

  methods: {
    /**
     * To be called on input.
     *
     * @return {void}
     */
    input() {
      this.canComplete = true;
    },

    /**
     * Restore a component value to its prop value.
     * Prop and ref keys must be the same.
     *
     * @param {string} key
     * @return {boolean}
     */
    restore(key) {
      Vue.set(this.$refs[key], 'newValue', this.$props[key]);
      return true;
    },

    /**
     * Emit a prop value update by ref and prop key.
     * Prop and ref keys must be the same.
     *
     * @param {string} key
     * @return {boolean}
     */
    change(key) {
      // Check if value changed
      let newValue = this.$refs[key].newValue;
      if (_.isEqual(newValue, this.$props[key]))
        return false;

      // Emit update
      this.$emit(`update:${key}`, newValue);
      return true;
    },

    /**
     * Run completion process.
     * Emits 'done'.
     *
     * @return {void}
     */
    complete() {
      this.updateKeys.forEach((key) => {
        this.change(key);
      });

      this.canComplete = false;
      this.$emit('done');
    },

    /**
     *
     */
    reset() {
      this.updateKeys.forEach((key) => {
        this.restore(key);
      });

      this.canComplete = false;
      this.canReset = false;
    }
  }
};
