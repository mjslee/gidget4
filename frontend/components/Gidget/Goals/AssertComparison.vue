<template>
  <span>
    <Value :value="args[0]" />
    <span class="is-operator">{{ operator }}</span>
    <Value :value="args[1]" />
  </span>
</template>


<script>
import Value from '../Content/Value';

export default {
  components: {
    Value
  },

  props: {
    operator: String,
    args: Array
  }
};
</script>
