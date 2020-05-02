<template>
  <!-- Equals Assertion -->
  <span v-if="assert == 'equal'">
    <assert-equal :args="args" />
  </span>
</template>


<style scoped>
span {
  font-family: monospace;
  font-size: 0.9rem;
}
</style>


<script>
import AssertEqual from './AssertEqual';

export default {
  components: {
    AssertEqual
  },

  props: {
    assert: String,
    args: Array
  }
}
</script>
