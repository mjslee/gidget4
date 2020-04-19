<template>
  <span @click="active = !active">
    <highlight :value="value" />
    <popover v-if="active" :active.sync="active" :element="this.$el">
      hello
    </popover>
  </span>
</template>


<style scoped>
span {
  cursor: pointer;
}
</style>


<script>
import Highlight from './Highlight';
import Popover from './Popover';


export default {
  name: 'Literal',

  components: { Highlight, Popover },

  props: {
    value: Array | Object | String | Boolean | Number
  },

  data() {
    return {
      active: false
    }
  }
}
</script>
