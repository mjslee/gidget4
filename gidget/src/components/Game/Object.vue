<template>
  <img
    :src="object.image"
    :style="{
        left: left + 'px',
        top: top + 'px',
        height: size + 'rem',
        width: size + 'rem',
        'z-index': object.layer || 0
      }" />
</template>


<style scoped>
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
</style>


<script>
export default {
  props: ["object", "tiles", "size"],


  data() {
    return {
      left: 0, top: 0
    }
  },


  created() {
    this.setPosition(this.object.position.x, this.object.position.y);
    this.object.vueComponent = this;
  },


  methods: {
    /**
     * Find Tile object
     * @param {function} callback
     */
    getTile(callback) {
      const tile = this.tiles.find(callback);
      return typeof tile !== undefined && typeof tile.$el !== undefined ?
        tile : undefined;
    },

    /**
     * Get visual offset of a Tile's DOM element.
     * @param {number} x
     * @param {number} y
     */
    getTileOffset(x, y) {
      const tile = this.getTile(obj => obj.x === x && obj.y === y);
      return tile ?
        { x: tile.$el.offsetLeft, y: tile.$el.offsetTop } : undefined;
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

      this.left = offset.x;
      this.top = offset.y;
    }
  },


  watch: { 
    "object.position": {
      handler(newVal, oldVal) {
        this.setPosition(newVal.x, newVal.y)
      },
      deep: true
    }
  }
}
</script>
