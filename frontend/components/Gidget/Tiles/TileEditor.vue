<template>
  <tile-input :position="position" v-model="sprite" v-if="selectedTile" />
</template>


<script>
import TileInput from '../Tiles/TileInput';
import { DefaultTileSprite } from '@/constants/sprites';


export default {
  components: {
    TileInput
  },

  computed: {
    /**
     * Selected tile from tiles store.
     *
     * @return {string} - Comma delimited string '1,0'
     */
    selectedTile() {
      return this.$store.getters['tiles/getSelected'];
    },

    /**
     * Position of the selected tile.
     *
     * @return {object[x,y]}
     */
    position() {
      const [ x, y ] = this.selectedTile.split(',');
      return { x: parseInt(x), y: parseInt(y) };
    },

    /**
     * Sprite value for selected tile.
     * 
     * @param {string} sprite
     * @return {string}
     */
    sprite: {
      get() {
        const tile = this.$store.getters['tiles/getTile'](this.position);
        return tile ? tile.sprite : DefaultTileSprite;
      },
      set(sprite) {
        this.$store.dispatch('tiles/setTile', {
          position: this.position, sprite
        });
      }
    }
  }
};
</script>
