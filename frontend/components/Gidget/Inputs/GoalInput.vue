<template>
  <assert-equals-input v-model="args" v-if="assert == 'equals'" />
</template>


<style scoped>
/deep/ .level-item {
  font-family: monospace !important;
  padding: 0 0.25rem;
}
</style>


<script>
import AssertEqualsInput from './AssertEqualsInput';


export default {
  components: {
    AssertEqualsInput
  },

  props: {
    assert: String,
    args: Array
  },
}
</script>
