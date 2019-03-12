<template>
  <img
    :src="image"
    :style="{ left: left + 'px', top: top + 'px',
      height: size + 'rem', width: size + 'rem' }" />
</template>


<style scoped>
img {
  position: absolute;
  cursor: pointer;
  transition: all 200ms;
}

.active {
  box-shadow: 0 0 3rem 1rem gold inset, 0 0 2rem goldenrod;
}
</style>


<script>
export default {
  props: ["object", "tiles", "objects", "size", "className"],

  data() {
    return {
      left: 0,
      top: 0,
      image: this.object.image
    }
  },


  created() {
    // Create proxy for object's position to update element's position when
    // the position in the world changes
    this.object.position = new Proxy(
      this.object.position, { set: this.setPositionCallback }
    );

    // Set initial object position
    this.left = this.getTileOffsetX(this.object.position[0]);
    this.top = this.getTileOffsetY(this.object.position[1]);
  },


  mounted() {
    this.object.vueComponent = this;
  },


  methods: {
    /*
     * Find Tile object
     */
    getTile(callback) {
      let tile = this.tiles.find(callback);
      if (typeof tile !== undefined && typeof tile.$el !== undefined)
        return tile;
      return undefined;
    },

    /*
     * Get X/Left offset of a Tile's DOM element.
     */
    getTileOffsetX(x) {
      let tile = this.getTile(obj => obj.x == x);
      return tile ? tile.$el.offsetLeft : -1;
    },

    /*
     * Get Y/Top offset of a Tile's DOM element.
     */
    getTileOffsetY(y) {
      let tile = this.getTile(obj => obj.y == y);
      return tile ? tile.$el.offsetTop : -1;
    },

    /*
     * Set GidgetObject's visual position inside page.
     */
    setPositionCallback(obj, prop, value) {
      obj[prop] = value;

      // Since position[0] and position[1] are X and Y respectively...
      // `prop` will either be 0 for X or 1 for Y
      switch(parseInt(prop)) {
        case 0: this.left = this.getTileOffsetX(value); break;  // X
        case 1: this.top = this.getTileOffsetY(value); break;   // Y
      }

      return true;
    },
  }
}
</script>
