<template>
  <!-- Equals Assertion -->
  <span v-if="assert == 'equals'">
    <assert-equals :args="args" />
  </span>
</template>


<style scoped>
span {
  font-family: monospace;
  font-size: 0.9rem;
}
</style>


<script>
import AssertEquals from './AssertEquals';

export default {
  components: {
    AssertEquals
  },

  props: {
    assert: String,
    args: Array
  }
}
</script>
