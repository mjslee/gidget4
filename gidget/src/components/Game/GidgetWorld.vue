
<template>
  <main id="world" ref="world">
    <GidgetObject
      v-for="obj in objects" :key="'obj-' + obj.id"
      :ref="'obj-' + obj.id" />

    <div
      v-for="row in worldSize" :key="'row-' +row"
      :style="{ height: tileSize + 'rem' }"
      class="game-row">
      <GidgetTile
        v-for="col in worldSize" :key="'col-' + col"
        :ref="'tile-' + (col - 1) + '-' + (row - 1)"
        :size="tileSize" type="grass" />
    </div>
  </main>
</template>


<style scoped>
#world {
  position: relative;
}
</style>



<script>
import GidgetEngine from '../../libraries/gidget-engine'
import GidgetTile from './GidgetTile'
import GidgetObject from './GidgetObject'


export default {
  components: {
    GidgetTile,
    GidgetObject
  },


  created() {
    // Create copy of engine
    this.engine = Object.assign({}, GidgetEngine)
    window.engine = this.engine  // Access in console for debugging purposes

    // Set as reference to engine's objects
    this.objects = this.engine.objects;

    // Engine callbacks
    this.engine.objectCreated = this.objectCreated;
    this.engine.objectGrabbed = this.objectGrabbed;
    this.engine.objectDropped = this.objectDropped;
    this.engine.objectDeleted = this.objectDeleted;
    this.engine.objectMoved = this.objectMoved;
  },


  mounted() {
    this.engine.createObject({});
  },


  methods: {
    getTileElement(x, y) {
      // Reference name of tile
      let tilePos = 'tile-' + x + '-' + y;

      // Get Tile component
      let tile = this.$refs[tilePos];
      if (tile === undefined) {
        console.log(`Unknown tile: ${tilePos}`);
        return undefined;
      }

      // Get Tile element
      let el = tile[0]['$el'];
      if (el === undefined) {
        console.log(`Unknown element: ${tilePos}`);
        return undefined;
      }

      // Return found element
      return el;
    },

    objectCreated(obj) {

    },

    objectMoved(obj) {

    },

    objectGrabbed(obj) {

    },

    objectDropped(obj) {

    },

    objectDeleted(obj) {

    }
  },


  data() {
    return {
      worldSize: 3,
      tileSize: 5,
      objects: []
    }
  },
}
</script>

