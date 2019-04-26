<template>
  <div :style="{ height: size + 'rem', width: size + 'rem' }"></div>
</template>


<style scoped>
div {
  display: inline-block;
  background-size: contain;
  border-radius: 0.25rem;
}

.grass { background-image: url("/gidget/sprites/grass.png") }
.dirt { background-image: url("/gidget/sprites/dirt.png") }
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
