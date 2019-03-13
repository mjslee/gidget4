<template>
  <div>
    <div>
      <input type="range" min="4" max="10" ref="t" @change="changeFoo">
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
import GidgetWorld from './GidgetWorld.vue'

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
    changeFoo() {
      this.world.size = parseInt(this.$refs['t'].value);
    }
  }
}
</script>
