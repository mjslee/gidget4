<template>
  <div>
    <div>
      <input type="range" min=4 max=10 :value="world.size" @change="changeWorldSize">
    </div>
    <GidgetWorld 
      ref="world"
      :tileSize="tileSize"
      :size="world.size"
      :tiles="world.tiles"
      :objects="world.objects" />
  </div>
</template>

<script>
import GidgetWorld from './World.vue'

export default {
  components: {
    GidgetWorld
  },

  props: {
    size: Number,
    tiles: Array[Object],
    objects: Array[Object],
  },

  data() {
    return {
      tileSize: 3,
      world: {
        size: this.size,
        tiles: this.tiles,
        objects: this.objects,
      }
    }
  },

  methods: {
    changeWorldSize(event) {
      this.world.size = parseInt(event.target.value);
    }
  }
}
</script>
