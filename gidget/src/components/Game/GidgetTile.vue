<template>
  <div :style="{ height: size + 'rem', width: size + 'rem' }" :class="type"></div>
</template>


<style scoped>
div {
  margin: 0.1rem;
  border-radius: 0.25rem;
  display: inline-block;
  background-size: contain;
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

  data() {
    return {
      type: "grass"
    }
  }
}
</script>
