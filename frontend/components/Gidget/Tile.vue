<template>
  <div :id="`tile-${x}-${y}`" :class="tileClass" :style="tileStyle" />
</template>


<style scoped>
.grass       { background-image: url("/gidget/sprites/grass.png"); }
.dirt        { background-image: url("/gidget/sprites/dirt.png"); }
.cobblestone { background-image: url("/gidget/sprites/cobblestone.png"); }

div {
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
    type: String,
    size: Number,
    margin: Number,
    selected: Boolean,
    x: Number,
    y: Number
  },

  computed: {
    /**
     *
     */
    tileClass() {
      let result = this.selected ? 'selected ' : '';
      try {
        result += this.type.toString().toLowerCase();
      }
      catch {
        result += 'grass';
      }
      return result;
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
  }
}
</script>
