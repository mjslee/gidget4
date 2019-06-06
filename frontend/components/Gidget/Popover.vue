<template>
  <div class="box">
    {{ identifier }}: {{ value }}
  </div>
</template>

<script>
export default {
  props: {
    identifier: String,
    type: String,
    value: Array | Object | String | Boolean | Number
  }
}
</script>
