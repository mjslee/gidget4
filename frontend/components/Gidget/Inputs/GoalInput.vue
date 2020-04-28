<template>
  <assert-equals-input v-model="internalArgs" v-if="assert == 'equals'" />
</template>

<style scoped>
div, article, section, span {
  font-family: monospace;
  padding: 0.25rem;
}
</style>

<script>
import _ from 'lodash';
import Vue from 'vue';
import AssertEqualsInput from './AssertEqualsInput';


export default {
  components: {
    AssertEqualsInput
  },

  props: {
    isCreating : {
      type    : Boolean,
      default : false
    },
    assert : String,
    args   : Array
  },

  computed: {
    /**
     * Internal counterpart to args prop.
     *
     * @param {Array[String]} value
     * @return {Array[String]}
     */
    internalArgs: {
      get() {
        return this.internalArgsValue;
      },
      set(value) {
        this.internalArgsValue = value;
        this.canComplete       = true;
      }
    },

    /**
     * Internal counterpart to assert prop.
     *
     * @param {String} value
     * @return {String}
     */
    internalAssert: {
      get() {
        return this.internalAssertValue;
      },
      set(value) {
        this.internalAssertValue = value;
        this.canComplete         = true;
      }
    },

    /**
     * Array of all available assertion types.
     *
     * @return {string}
     */
    availableAssertions() {
      return Object.values(assertions).filter((a) => typeof a == 'object');
    },
  },

  data() {
    return {
      internalAssertValue: _.clone(this.$props.assert),
      internalArgsValue:   _.clone(this.$props.args),

      canComplete: false,
      canReset:    false,
    };
  },

  methods: {
    /**
     * Complete changes to dialogue props.
     * Emits @done.
     *
     * @return {void}
     */
    complete() {
      this.$emit('update:assert', this.internalAssert);
      this.$emit('update:args',   this.internalArgs);

      this.canComplete = false;
      this.$emit('done');
    },

    /**
     * Reset internalProps to values of props.
     * Emits @reset.
     *
     * @return {void}
     */
    reset() {
      this.internalAssert = _.clone(this.$props.assert);
      this.internalArgs   = _.clone(this.$props.args);

      this.$nextTick(() => {
        this.canReset = false;
        this.canComplete = false;
      });

      this.$emit('reset');
    },

  }
}
</script>
