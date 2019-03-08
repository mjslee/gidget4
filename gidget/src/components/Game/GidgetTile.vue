<template>
  <div 
    :style="{ height: size + 'rem', width: size + 'rem' }"
    :class="type"></div>
</template>


<style scoped>
div {
  border: 1px solid transparent;
  display: inline-block;
  background: green;
}
</style>


<script>
export default {
  props: {
    size: Number,
    type: String,
    x: Number,
    y: Number
  }
}
</script>
