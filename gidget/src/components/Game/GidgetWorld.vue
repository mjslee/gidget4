<template>
  <main id="world" ref="world">
    <div
      v-for="y in size" :key="'y-' +y"
      :style="{ height: tileSize + 'rem' }"
      class="game-row">
      <GidgetTile
        v-for="x in size" :key="'x-' + x" ref="tiles"
        :size="tileSize"
        :x="x-1" :y="y-1" />
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
    size: Number
  },

  components: {
    GidgetTile,
    GidgetObject
  },


  created() {
    // Create copy of engine
    this.engine = Object.assign({}, GidgetEngine);
    window.engine = this.engine;

    // Engine callbacks
    /*this.engine.objectCreated = this.objectCreated;
    this.engine.objectGrabbed = this.objectGrabbed;
    this.engine.objectDropped = this.objectDropped;
    this.engine.objectDeleted = this.objectDeleted;
    this.engine.objectMoved = this.objectMoved;*/

    this.engineObjects = this.engine.objects;
  },


  mounted() {
    this.engine.createObject({
      type: "gidget",
      position: [0, 0]
    });
  },


  methods: {
    setTileSprite(x, y) {

    }
  },

  data() {
    return {
      tileSize: 5,
      engineObjects: []
    }
  },
}
</script>

