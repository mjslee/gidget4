<template>
  <b-autocomplete
    v-model="internalValue"
    :data="filteredData"
    :disabled="disabled"
    @typing="filterData"
    icon-right="chevron-down"
    keep-first
    open-on-focus
  />
</template>


<script>
import Objects from '@/assets/gidget/game/objects';


export default {
  props: {
    value: {
      type: String
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },

  computed: {
    /**
     * Array of available object keys.
     *
     * @return {array[string]}
     */
    types() {
      if (!this.disabled)
        return Object.keys(Objects);
    },

    /**
     * Internal value prop.
     *
     * @param {string} value
     * @return {string}
     */
    internalValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },
  },

  data() {
    return {
      filteredData: this.types
    };
  },

  methods: {
    /**
     * Set the filteredData with a filter.
     *
     * @param {string} value
     * @return {void}
     */
    filterData(value) {
      this.filteredData = !value ? this.types : this.types.filter((type) =>
        type.toLowerCase().indexOf(value.toLowerCase()) >= 0);
    },
  }
}
</script>
