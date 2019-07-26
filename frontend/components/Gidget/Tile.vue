<template>
  <div
    :id="`tile-${x}-${y}`"
    :style="{ height: size + 'rem', width: size + 'rem' }"
  />
</template>


<style scoped>
div {
  display: inline-block;
  background-size: contain;
  border-radius: 0.25rem;
}

.grass { background-image: url("/gidget/sprites/grass.png") }
.dirt { background-image: url("/gidget/sprites/dirt.png") }
.cobblestone { background-image: url("/gidget/sprites/cobblestone.png") }
</style>


<script>
export default {
  props: {
    size: Number,
    x: Number,
    y: Number
  },
}
</script>
