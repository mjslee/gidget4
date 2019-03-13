<template>
  <div id="app">
    <!-- <GidgetWorld --> 
    <!--   :size="world.size" -->
    <!--   :tiles="world.tiles" -->
    <!--   :objects="world.objects" /> -->
    <GidgetEditor 
      :size="world.size"
      :tiles="world.tiles"
      :objects="world.objects" />
  </div>
</template>


<script>
import GidgetWorld from './components/Game/GidgetWorld.vue'
import GidgetEditor from './components/Game/GidgetEditor.vue'

export default {
  name: 'app',
  components: {
    GidgetWorld,
    GidgetEditor
  },

  data() {
    return {
      world: {
        size: 4,
        tiles: [
          { type: 'dirt', position: [1, 0] },
        ],
        objects: [
          { type: 'Gidget', position: [1, 1] },
          { type: 'Puppy', position: [2, 3] },

          //{ type: 'Wall', position: [1, 0] },
        ]
      }
    }
  }
}
</script>


<style>
#app {
  display:inline-block;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
