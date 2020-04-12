import _ from 'lodash';
import Vue from 'vue';


export default {
  data() {
    return {
      canReset    : false,
      canComplete : false,
      updateKeys  : []
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
     * Emit a prop value update by ref and prop key.
     * Prop and ref keys must be the same.
     *
     * @param {string} key
     * @param {function} callback
     * @return {boolean}
     */
    change(key, callback) {
      // Check if value changed
      const ref = this.$refs[key];
      if (!ref)
        return false;

      // Get newValue and run it through callback if its a function
      let newValue = ref.newValue || ref.value1;
      if (typeof callback == 'function')
        newValue = callback(newValue);

      // Ensure values are not the same
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
        if (typeof key == 'object')
          this.change(key.key, key.value);
        else
          this.change(key);
      });

      this.canComplete = false;
      this.$emit('done');
    },

    /**
     * Restore component values to their prop values.
     *
     * @return {void}
     */
    reset() {
      this.updateKeys.forEach((key) => {
        if (typeof key == 'object')
          key = key.key;

        this.$refs[key].newValue = this.$props[key];
      });

      this.canComplete = false;
      this.canReset = false;
    }
  }
};
