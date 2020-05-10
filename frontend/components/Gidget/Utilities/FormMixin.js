import _ from 'lodash';
import Vue from 'vue';
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';


extend('identifier', (value) => {
  if (value.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/))
    return true;

  return 'This field must be an identifier';
});


extend('required', {
  ...required,
  message: 'This field is required'
});


export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },

  data() {
    return {
      props: this.$clone(this.$props),
      canReset: false
    }
  },

  methods: {
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
      if (typeof this.$refs.observer != 'undefined')
        this.$refs.observer.reset();
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
        this.canReset = false;
        if (typeof this.$refs.observer != 'undefined')
          this.$refs.observer.reset();
      });
    }
  }
};
