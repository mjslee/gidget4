<template>
  <b-autocomplete
    v-model="internalValue"
    :data="types"
    :disabled="disabled"
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
  }
}
</script>
