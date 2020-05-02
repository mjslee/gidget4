import _ from 'lodash';
import Vue from 'vue';


export default {
  data() {
    return {
      props: this.$clone(this.$props),

      canReset: false,
      canComplete: false,
    }
  },

  mounted() {
    this.watchProps();
  },

  methods: {
    /**
     * Watch internal prop values and compare against $prop values.
     * Set completion ability of form when values are different.
     *
     * @return {void}
     */
    watchProps() {
      Object.keys(this.props).forEach((prop) =>
        this.$watch(() => this.props[prop], (value) =>
          this.canComplete = !_.isEqual(this.$props[prop], value)
        )
      );
    },

    /**
     * Emit a prop value update.
     *
     * @param {string} prop
     * @return {void}
     */
    emitUpdate(prop) {
      const newValue = this.props[prop];
      if (!_.isEqual(newValue, this.$props[prop]))
        this.$emit(`update:${prop}`, this.$clone(newValue));
    },

    /**
     * Run completion process.
     * Emits 'done'.
     *
     * @return {void}
     */
    complete() {
      Object.keys(this.props).forEach((prop) => this.emitUpdate(prop));
      this.canComplete = false;
      this.$emit('done');
    },

    /**
     * Restore component values to their prop values.
     *
     * @return {void}
     */
    reset() {
      this.props = this.$clone(this.$props);

      this.$nextTick(() => {
        this.canComplete = false;
        this.canReset = false;
      });
    }
  }
};
