<template>
  <tile-form :position="position" :sprite.sync="sprite" v-if="selectedTile" />
</template>


<script>
import TileForm from '../Tiles/TileForm';


export default {
  components: {
    TileForm
  },

  computed: {
    /**
     *
     */
    selectedTile() {
      return this.$store.getters['tiles/getSelected'];
    },

    /**
     *
     */
    position() {
      const [ x, y ] = this.selectedTile.split(',');
      return { x: parseInt(x), y: parseInt(y) };
    },

    /**
     *
     */
    sprite: {
      get() {
        const [ x, y ] = this.selectedTile.split(',');
        const tile = this.$store.getters['tiles/getTile']({ x, y });
        return tile ? tile.sprite : 'grass';
      },
      set(value) {
        this.$store.dispatch('tiles/setTile', {
          position: this.position, sprite: value
        });

        console.log(this.$store.getters['tiles/getTiles']);
      }
    }
  }
};
</script>
