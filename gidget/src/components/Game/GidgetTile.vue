<template>
  <div :style="{ height: size + 'rem', width: size + 'rem' }"></div>
</template>


<style scoped>
div {
  display: inline-block;
  margin: 0.1rem;
  background-size: contain;
  border-radius: 0.25rem;
}

.grass { background-image: url("/sprites/grass.png") }
.dirt { background-image: url("/sprites/dirt.png") }
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
