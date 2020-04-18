<template>
  <span @click="togglePopover">
    {{ value }}

    <popover :active.sync="isPopoverActive" :element="this" />
  </span>

</template>


<script>
import Popover from './Popover'

export default {
  name: 'Literal',

  components: {
    Popover
  },

  props: {
    value: Array | Object | String | Boolean | Number
  },

  data() {
    return {
      isPopoverActive: false
    }
  },

  methods: {
    togglePopover() {
      this.isPopoverActive = !this.isPopoverActive;
    }
  }
}
</script>
