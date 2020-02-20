<template>
  <div
    :id="`tile-${x}-${y}`"
    :class="tileType"
    :style="{ height: size + 'rem', width: size + 'rem' }"
  />
</template>


<style scoped>
div {
  display: inline-block;
  background-size: contain;
  border-radius: 0.25rem;
}

.grass       { background-image: url("/gidget/sprites/grass.png") }
.dirt        { background-image: url("/gidget/sprites/dirt.png") }
.cobblestone { background-image: url("/gidget/sprites/cobblestone.png") }
</style>


<script>
export default {
  props: {
    type: String,
    size: Number,
    x: Number,
    y: Number
  },

  computed: {
    /**
     *
     */
    tileType() {
      try {
        return this.type.toString().toLowerCase();
      }
      catch {
        return 'grass';
      }
    }
  }
}
</script>
