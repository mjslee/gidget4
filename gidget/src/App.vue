<template>
  <div id="app">
    <GidgetGame
      :size="world.size"
      :tiles="world.tiles"
      :objects="world.objects" />
  </div>
</template>


<script>
import GidgetGame from './components/Game/Game'


export default {
  name: 'app',
  components: {
    GidgetGame
  },

  data() {
    return {
      world: {
        size: 4,
        tiles: [
          { type: 'dirt', position: { x: 1, y: 2 }},
        ],
        objects: [
          { type: 'Gidget', position: { x: 1, y: 1 }, isPlayer: true },
          { type: 'Puppy', position: {x: 2, y: 3} },
        ]
      }
    }
  }
}
</script>
