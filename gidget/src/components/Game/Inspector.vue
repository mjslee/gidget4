<template>
  <div>
    <input type="text" :value="object.name" />
  </div>
</template>


<script>
export default {
  props: {
    object: Object
  }
}
</script>
