<template>
  <div class="box">
    {{ identifier }} ({{ type }}): {{ internalValue }}
  </div>
</template>

<script>
export default {
  props: {
    identifier: String,
    type: String,
    value: Array | Object | String | Boolean | Number
  },


  computed: {
    internalValue() {
      return typeof this.value !== 'object' ? this.value : '';
    }
  }
}
</script>
