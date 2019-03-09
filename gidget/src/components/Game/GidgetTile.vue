<template>
  <div :style="{ height: size + 'rem', width: size + 'rem' }" :class="type"></div>
</template>


<style scoped>
div {
  border: 1px solid white;
  display: inline-block;
  background-size: contain;
}

.grass {
  background-image: url("/sprites/grass.png");
}

.dirt {
  background-image: url("/sprites/dirt.png");
}
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
