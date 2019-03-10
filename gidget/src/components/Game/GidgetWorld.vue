<template>
  <main id="world" ref="world">
    <div v-for="y in size" :key="'y-' +y" class="game-row">
      <GidgetTile v-for="x in size" :key="'x-' + x" ref="tiles"
        :size="tileSize" :x="x-1" :y="y-1" />
    </div>
    <GidgetObject @click.native="activeID = obj.id"
      v-for="obj in engineObjects" :key="'obj-' + obj.id" ref="objects"
      :class="activeID === obj.id ? 'active' : ''" :src="obj.image"
      :object="obj" :tiles="$refs['tiles']" :size="tileSize" />
  </main>
</template>


<style scoped>
#world {
  position: relative;
  display: inline-block;
}

.game-row {
  line-height: 0
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
    objects: Array[Object],
  },

  data() {
    return {
      tileSize: 5,
      engineObjects: [],
      activeID: undefined
    }
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
    this.createObjects();
  },


  methods: {
    /*
     * Loop through pre-defined tiles and set tile types.
     */
    setTiles() {
      for (var i = 0, len = this.tiles.length; i < len; i++) {
        // Find tile at X and Y coords
        let tile = this.$refs['tiles'].find(tile => {
          return tile.x === this.tiles[i].position[0] &&
            tile.y === this.tiles[i].position[1]
        });

        // Set tile type
        if (tile !== undefined)
          tile.type = this.tiles[i].type
      }
    },

    /*
     * Loop through pre-defined objects and create them.
     */
    createObjects() {
      for (var i = 0, len = this.objects.length; i < len; i++) {
        this.engine.createObject(this.objects[i]);
      }
    },
  },
}
</script>

