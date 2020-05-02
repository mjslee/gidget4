<template>
  <assert-equal-input v-model="args" v-if="assert == 'equal'" />
</template>


<style scoped>
/deep/ .level-item {
  font-family: monospace !important;
  padding: 0 0.25rem;
}
</style>


<script>
import AssertEqualInput from './AssertEqualInput';


export default {
  components: {
    AssertEqualInput
  },

  props: {
    assert: String,
    args: Array
  },
}
</script>
