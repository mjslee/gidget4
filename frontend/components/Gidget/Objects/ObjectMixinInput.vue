<template>
  <order-tag-input
    :selected.sync="selected"
    :data="mixins"
    v-model="internalValue"
  />
</template>


<script>
import OrderTagInput from '../Utilities/OrderTagInput';
import Mixins from '@/assets/gidget/game/mixins';


export default {
  props: {
    value: Array[String]
  },

  components: {
    OrderTagInput
  },
  
  computed: {
    /**
     * Array of available mixin keys.
     *
     * @return {array[string]}
     */
    mixins() {
      return Object.keys(Mixins);
    },

    /**
     * Value prop.
     *
     * @param {array[string]} value
     * @return {array[string]}
     */
    internalValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },

  data() {
    return {
      selected: ''
    };
  }
}
</script>
