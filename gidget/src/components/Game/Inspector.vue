<template>
  <div v-if="object" style="border: 1px solid red;margin-top:10px">
    <input type="text" :value="object.name" />
    <input type="text" :value="object.type" />
    <input type="text" v-model="object.position2.x" />
    <input type="text" :value="object.position[1]" />
  </div>
</template>


<script>
export default {
  props: {
    object: Object
  }
}
</script>
