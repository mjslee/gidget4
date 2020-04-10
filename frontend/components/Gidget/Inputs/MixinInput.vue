<template>
  <b-taginput
    ref="input"
    v-model="internalValue"
    :data="filteredMixins"
    @typing="filterMixins"
    autocomplete
  >
  </b-taginput>
</template>


<script>
import Mixins from '@/assets/gidget/game/mixins';


export default {
  props: {
    value: Array[String]
  },

  computed: {
    /**
     * Shallow clone of values prop.
     *
     * @param {array} value
     * @return {array}
     */
    internalValue: {
      get() {
        return Object.assign([], this.value);
      },
      set(value) {
        this.$emit('input', value);
      }
    },

    /**
     * Array of values from the tag input.
     *
     * @param {array} value
     * @return {array}
     */
    newValue: {
      get() {
        return this.$refs.input.tags;
      },
      set(value) {
        this.internalValue = value;
      }
    },

    /**
     * Array of available mixins.
     *
     * @return {array}
     */
    availableMixins() {
      return Object.keys(Mixins);
    },
  },

  data() {
    return {
      filteredMixins: [],
    };
  },


  methods: {
    /**
     * Set the filteredMixins with a filter.
     *
     * @param {string} value
     * @return {void}
     */
    filterMixins(value) {
      this.filteredMixins = this.availableMixins.filter((mixin) =>
        mixin.toLowerCase().indexOf(value.toLowerCase()) >= 0
      );
    },
  }
};
</script>
