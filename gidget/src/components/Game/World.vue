<template>
  <main id="world" ref="world">
    <div
      v-for="row in worldSize" :key="row"
      :style="{ height: tileSize + 'rem' }"
      class="game-row">
      <Tile
        v-for="col in worldSize" :key="col"
        :ref="'tile-'+col+'-'+row" :size="tileSize" type="grass" />
    </div>
  </main>
</template>


<script>
import Engine from '../../libraries/gidget-engine'
import Tile from './Tile.vue'


export default {
  components: {
    Tile
  },

  created() {
    // Create copy of engine
    this.engine = Object.assign({}, Engine)
    window.engine = this.engine  // Access in console for debugging purposes
  },

  methods: {

  },

  data() {
    return {
      worldSize: 3,
      tileSize: 5
    }
  },
}
</script>

