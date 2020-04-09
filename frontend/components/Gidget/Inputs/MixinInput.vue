<template>
  <b-taginput
    ref="input"
    :value="value"
    :data="filteredMixins"
    @typing="filterMixins"
    @input="updateMixins"
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
     * Array of available mixins.
     *
     * @return {array}
     */
    availableMixins() {
      return Object.keys(Mixins);
    },

    /**
     * Current value of the tag input.
     *
     * @return {array}
     */
    newValue() {
      return this.$refs.input.tags;
    }
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
     * @return {void}
     */
    filterMixins(value) {
      this.filteredMixins = this.availableMixins.filter((mixin) =>
        mixin.toLowerCase().indexOf(value.toLowerCase()) >= 0
      );
    },

    /**
     * Emit update of the mixins array.
     *
     * @return {void}
     */
    updateMixins(value) {
      this.$emit('input', value);
    }
  }
};
</script>
