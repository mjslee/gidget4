<template>
  <div id="app">
    <GidgetWorld 
      :size="world.size"
      :tiles="world.tiles"
      :objects="world.objects"
      @update:activeObject="updateActiveObject"
      />

    <GidgetInspector
      :object="playerObject"
      />

    <GidgetInspector
      :object="activeObject"
      />
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
    updateActiveObject(payload) {
      this.activeObject = payload;
    }
  },

  data() {
    return {
      playerObject: { name: "Player" },
      activeObject: { name: "Active" },
      world: {
        size: this.size,
        tiles: this.tiles,
        objects: this.objects,
      }
    }
  }
}
</script>
