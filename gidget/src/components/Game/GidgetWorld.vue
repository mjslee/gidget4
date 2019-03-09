<template>
  <main id="world" ref="world">
    <div
      v-for="y in size" :key="'y-' +y"
      :style="{ height: tileSize + 'rem' }"
      class="game-row">
      <GidgetTile
        v-for="x in size" :key="'x-' + x" ref="tiles"
        :size="tileSize" :x="x-1" :y="y-1" />
    </div>
    <GidgetObject
      v-for="obj in engineObjects" :key="'obj-' + obj.id" ref="objects"
      :object="obj" :objects="$refs['objects']"
      :tiles="$refs['tiles']" :size="tileSize" />
  </main>
</template>


<style scoped>
#world {
  position: relative;
  display: inline-block;
}
</style>



<script>
import GidgetEngine from '../../assets/game/gidget-engine'
import GidgetTile from './GidgetTile'
import GidgetObject from './GidgetObject'


export default {
  props: {
    size: Number,
    tiles: Array[Object],
  },

  components: {
    GidgetTile,
    GidgetObject
  },


  created() {
    // Create copy of engine
    this.engine = Object.assign({}, GidgetEngine);
    this.engineObjects = this.engine.objects;
  },


  mounted() {
    this.setTiles();
  },


  methods: {
    /*
     * Loop through tiles and set tile types.
     */
    setTiles() {
      for (var i = 0, len = this.tiles.length; i < len; i++) {
        // Find tile at X and Y coords
        let tile = this.$refs['tiles'].find(
          tile => tile.x === this.tiles[i].x && tile.y === this.tiles[i].y
        );

        // Set tile type
        if (tile !== undefined)
          tile.type = this.tiles[i].type
      }
    },
  },

  data() {
    return {
      tileSize: 5,
      engineObjects: []
    }
  },
}
</script>

