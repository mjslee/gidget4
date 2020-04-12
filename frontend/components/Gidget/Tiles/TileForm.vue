<template>
  <article>
    <sprite-input v-model="internalSprite" :sprites="availableSprites" />
  </article>
</template>


<script>
import SpriteInput from '../Inputs/SpriteInput';
import { SpriteBaseUrl, TileSprites } from '@/constants/sprites';


export default {
  components: {
    SpriteInput
  },

  props: {
    position: Object,
    sprite: String
  },

  computed: {
    /**
     *
     */
    availableSprites() {
      return TileSprites.map((sprite) => ({
        title : sprite.title,
        src   : SpriteBaseUrl + sprite.src
      }));
    },

    /**
     *
     */
    internalSprite: {
      get() {
        return this.sprite;
      },
      set(value) {
        this.$emit('update:sprite', value);
      }
    }
  }
}
</script>
