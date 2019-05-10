<template>
  <div v-if="object">
    <table>
      <tr><th>ID:</th><td v-text="object.id"></td></tr>
      <tr><th>Name:</th><td v-text="object.name"></td></tr>
      <tr><th>Type:</th><td v-text="object.type"></td></tr>
      <tr><th>Energy:</th><td v-text="object.energy"></td></tr>
      <tr><th>Layer:</th><td v-text="object.layer"></td></tr>
      <tr><th>Blocking:</th><td v-text="object.blocking"></td></tr>
      <tr><th>Position:</th><td v-text="object.position"></td></tr>
    </table>
  </div>
</template>


<style scoped>
div {
  border: 1px solid black;
  margin: 1px;
  display: inline-block;
}
</style>


<script>
export default {
  props: {
    object: Object
  },

  mounted() {
    this.$nextTick(() => {
    if (typeof this.object !== 'undefined')
      window.obj1 = this.object;
    
    })
  }
}
</script>
