<template>
  <div :id="`tile-${id}`" :class="tileClass" :style="tileStyle" @click="select"></div>
</template>


<style scoped>
.grass       { background-image: url("/gidget/sprites/grass.png"); }
.dirt        { background-image: url("/gidget/sprites/dirt.png"); }
.cobblestone { background-image: url("/gidget/sprites/cobblestone.png"); }

.tile {
  display: inline-block;
  background-size: contain;
  border-radius: 0.25rem;
  border: 1px solid black;
}

.selected {
  pointer-events: none;
  box-shadow: 0 0 3rem 1rem lime inset, 0 0 2rem lime;
}
</style>


<script>
export default {
  props: {
    type: {
      type: String,
      default: 'grass'
    },
    size: {
      type: Number,
      default: 5
    },
    margin: {
      type: Number,
      default: .1
    },
    position: Object
  },

  computed: {
    /**
     *
     */
    id() {
      return `${this.position.x}-${this.position.y}`;
    },

    /**
     *
     */
    isSelected() {
      return this.$store.state.game.selectedTile == this.id;
    },

    /**
     *
     */
    tileType() {
      const tile = this.$store.getters['game/getTile'](this.position);
      return (typeof tile == 'object') ? (tile.type || this.type) : (this.type);
    },

    /**
     *
     */
    tileClass() {
      return `${this.tileType} tile${this.isSelected ? ' selected' : ''}`;
    },

    /**
     *
     */
    tileStyle() {
      return {
        margin: this.margin + 'rem',
        height: this.size + 'rem',
        width: this.size + 'rem'
      };
    }
  },

  methods: {
    /**
     *
     */
    select() {
      this.$store.commit('game/setSelectedTile', this.id);
    }
  }
}
</script>
