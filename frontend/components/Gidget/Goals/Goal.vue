<template>
  <assert-comparison
    v-if="assert == 'equal'"
    operator="=="
    :args="args"
  />
  <assert-comparison
    v-else-if="assert == 'notEqual'"
    operator="!="
    :args="args"
  />
  <assert-comparison
    v-else-if="assert == 'lessThan'"
    operator="<"
    :args="args"
  />
  <assert-comparison
    v-else-if="assert == 'lessThanOrEqual'"
    operator="<="
    :args="args"
  />
  <assert-comparison
    v-else-if="assert == 'greaterThan'"
    operator=">"
    :args="args"
  />
  <assert-comparison
    v-else-if="assert == 'greaterThanOrEqual'"
    operator=">="
    :args="args"
  />
</template>


<script>
import AssertComparison from './AssertComparison';

export default {
  components: {
    AssertComparison
  },

  props: {
    assert: String,
    args: Array,
  }
}
</script>
