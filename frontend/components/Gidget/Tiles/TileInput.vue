<template>
  <sprite-input v-model="internalValue" :sprites="sprites" />
</template>


<script>
import SpriteInput from '../Inputs/SpriteInput';
import { TileSprites } from '@/constants/sprites';


export default {
  components: {
    SpriteInput
  },

  props: {
    value: String
  },

  computed: {
    /**
     * Object of available tile sprites.
     *
     * @return {object}
     */
    sprites() {
      return TileSprites;
    },

    /**
     * Internal value for the input.
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
    }
  }
}
</script>
