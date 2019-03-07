<template>
  <main id="world" ref="world">
    <div
      v-for="row in worldSize" :key="row"
      :style="{ height: tileSize + 'rem' }"
      class="game-row">
      <GidgetTile
        v-for="col in worldSize" :key="col"
        :ref="'tile-'+col+'-'+row" :size="tileSize" type="grass" />
    </div>
  </main>
</template>


<script>
import GidgetEngine from '../../libraries/gidget-engine'
import GidgetTile from './Tile.vue'


export default {
  components: {
    GidgetTile
  },

  created() {
    // Create copy of engine
    this.engine = Object.assign({}, GidgetEngine)
    window.engine = this.engine  // Access in console for debugging purposes

    // Hook up to engine
    this.engine.objectCreated = this.onObjectCreate;
  },

  methods: {
    onObjectCreate() {

    },
  },

  data() {
    return {
      worldSize: 3,
      tileSize: 5
    }
  },
}
</script>

