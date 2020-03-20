<template>
  <b-button @click="addObject">Add Object</b-button>
</template>


<script>
import GidgetObjects from '@/assets/gidget/game/objects';

export default {
  computed: {

  },

  methods: {
    addObject() {
      this.$store.dispatch('game/addObject');
    }
  }
}
</script>
