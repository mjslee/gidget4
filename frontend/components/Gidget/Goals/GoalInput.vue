<template>
  <assert-comparison-input
    v-if="assert == 'equal'"
    operator="=="
    left-label="that this"
    right-label="is equal to this"
    v-model="args"
  />
  <assert-comparison-input
    v-else-if="assert == 'notEqual'"
    operator="!="
    left-label="that this"
    right-label="is not equal to this"
    v-model="args"
  />
  <assert-comparison-input
    v-else-if="assert == 'lessThan'"
    operator="<"
    left-label="that this"
    right-label="is less than this"
    v-model="args"
  />
  <assert-comparison-input
    v-else-if="assert == 'lessThanOrEqual'"
    operator="<="
    left-label="that this"
    right-label="is less than or equal to this"
    v-model="args"
  />
  <assert-comparison-input
    v-else-if="assert == 'greaterThan'"
    operator=">"
    left-label="that this"
    right-label="is greater than this"
    v-model="args"
  />
  <assert-comparison-input
    v-else-if="assert == 'greaterThanOrEqual'"
    operator=">="
    left-label="that this"
    right-label="is greater than or equal this"
    v-model="args"
  />
</template>


<style scoped>
/deep/ .level-item {
  font-family: monospace !important;
  padding: 0 0.25rem;
}
</style>


<script>
import AssertComparisonInput from './AssertComparisonInput';


export default {
  components: {
    AssertComparisonInput
  },

  props: {
    assert: String,
    args: Array
  }
}
</script>
