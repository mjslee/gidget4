<template>
  <div>
    <span class="is-keyword">assert</span>
    <GidgetValue :code="args[0]" />
    <span class="is-operator">==</span>
    <GidgetValue :code="args[1]" />
  </div>
</template>


<script>
import GidgetValue from '../Content/Value'

export default {
  components: {
    GidgetValue
  },

  props: {
    args: Array
  }
};
</script>
