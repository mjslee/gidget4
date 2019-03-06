<template>
  <div :style="{ height: size + 'rem', width: size + 'rem' }"></div>
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
  props: ['size']
}
</script>
