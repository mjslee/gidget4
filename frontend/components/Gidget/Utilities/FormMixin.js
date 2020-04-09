import _ from 'lodash';


export default {
  data() {
    return {
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
     * Emit a prop value update by ref and prop key.
     * Prop and Ref must be the same.
     *
     * @param {string} key
     * @return {boolean}
     */
    change(key) {
      // Ensure ref exists
      const ref = this.$refs[key];
      if (!ref)
        return false;

      // Check if value changed
      let newValue = ref.newValue;
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
    }
  }
};
