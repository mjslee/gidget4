<template>
  <img
    :src="object.image"
    :style="{
        left: left + 'px',
        top: top + 'px',
        height: getSize,
        width: getSize,
        'z-index': object.layer || 0
      }" />
</template>


<style scoped>
@keyframes spin {
    from { transform:rotate(0deg); }
    to { transform:rotate(360deg); }
}

img {
  z-index: 2;
  position: absolute;
  cursor: pointer;
  transition: all 200ms;
}

.selected {
  z-index: 1000 !important;
  pointer-events: none;
  box-shadow: 0 0 3rem 1rem gold inset, 0 0 2rem goldenrod;
}

.spinning {
  transition: all 5s;
  animation-name: spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}
</style>


<script>
export default {
  props: ["object", "tiles", "size"],


  data() {
    return {
      left: 0,
      top: 0,
      scale: this.object.scale
    }
  },


  created() {
    this.setPosition(...this.getPosition());
    this.object.vueComponent = this;
  },


  computed: {
    /**
     * Calculate size of object.
     */
    getSize() {
      return this.size * this.scale + 'rem';
    }
  },


  methods: {
    /**
     * Find Tile object
     * @param {function} callback
     */
    getTile(callback) {
      const tile = this.tiles.find(callback);
      if (typeof tile === undefined)
        return undefined;
      return typeof tile.$el !== undefined ? tile : undefined;
    },

    /**
     * Get visual offset of a Tile's DOM element.
     * @param {number} x
     * @param {number} y
     */
    getTileOffset(x, y) {
      const tile = this.getTile(obj => obj.x === x && obj.y === y);
      return tile === undefined ? undefined : { 
        x: tile.$el.offsetLeft,
        y: tile.$el.offsetTop,
        height: tile.$el.offsetHeight,
        width: tile.$el.offsetWidth
      };
    },

    /**
     * Set GidgetObject's visual position inside page.
     * @param {number} x
     * @param {number} y
     */
    setPosition(x, y) {
      const offset = this.getTileOffset(x, y);
      if (offset === undefined)
        return false;

      this.left = offset.x - (this.scale - 1) * offset.width / 2;
      this.top = offset.y - (this.scale - 1) * offset.height;
    },

    /**
     * Get position in array format.
     */
    getPosition() {
      return [this.object.position.x, this.object.position.y];
    }
  },


  watch: { 
    'object.position': {
      /**
       * Watch object's position to visually move in world.
       */
      handler(newVal, oldVal) {
        this.setPosition(newVal.x, newVal.y);
      },
      deep: true
    },

    'object.scale': {
      /**
       * Watch object's scale to visually move in world.
       */
      handler(newVal, oldVal) {
        this.scale = newVal;
      }
    },

    scale: {
      /**
       * Watch object's scale to visually move in world.
       */
      handler(newVal, oldVal) {
        this.setPosition(...this.getPosition());
      }
    }
  }
}
</script>
