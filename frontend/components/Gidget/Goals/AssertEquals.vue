<template>
  <span>
    <Literal :value="args[0]" />
    <span class="is-operator">==</span>
    <Literal :value="args[1]" />
  </span>
</template>


<script>
import Literal from '../Content/Literal';

export default {
  components: {
    Literal
  },

  props: {
    args: Array
  }
};
</script>
