<template>
  <div id="app">
    <GidgetWorld 
      ref="world"
      :size="world.size"
      :tiles="world.tiles"
      :objects="world.objects"
      @update:selectedObject="updateSelectedObject" />

    <br/>
    <GidgetInspector
      :object="playerObject" />

    <GidgetInspector
      :object="selectedObject" />
  </div>
</template>


<script>
import GidgetWorld from './World.vue';
import GidgetInspector from './Inspector.vue';


export default {
  components: {
    GidgetWorld,
    GidgetInspector
  },


  props: {
    size: Number,
    tiles: Array[Object],
    objects: Array[Object],
  },


  methods: {
    updatePlayerObject(payload) {
      this.playerObject = payload;
    },

    updateSelectedObject(payload) {
      this.selectedObject = payload;
    }
  },


  mounted() {
    this.playerObject = this.$refs['world'].world.player;
  },


  data() {
    return {
      playerObject: undefined,
      selectedObject: undefined,
      world: {
        size: this.size,
        tiles: this.tiles,
        objects: this.objects
      }
    }
  }
}
</script>
