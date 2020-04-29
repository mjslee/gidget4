<template>
  <article>
    {{ identifier }}: {{ value }}
  </article>
</template>


<script>
export default {
  props: {
    identifier: String,
    value: Array | Object | String | Boolean | Number
  }
}
</script>
