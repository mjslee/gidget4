<template>
  <main id="world" ref="world">
    <div
      v-for="y in worldSize" :key="'y-' +y"
      :style="{ height: tileSize + 'rem' }"
      class="game-row">
      <GidgetTile
        v-for="x in worldSize" :key="'x-' + x" ref="tiles"
        :size="tileSize" type="grass"
        :x="x-1" :y="y-1" />
    </div>
    <GidgetObject
      v-for="obj in objects" :key="'obj-' + obj.id" ref="objects"
      :object="obj" :objects="$refs['objects']" :tiles="$refs['tiles']" />
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
    this.engine = Object.assign({}, GidgetEngine);
    window.engine = this.engine;

    // Engine callbacks
    this.engine.objectCreated = this.objectCreated;
    this.engine.objectGrabbed = this.objectGrabbed;
    this.engine.objectDropped = this.objectDropped;
    this.engine.objectDeleted = this.objectDeleted;
    this.engine.objectMoved = this.objectMoved;

    this.objects = this.engine.objects;
  },


  mounted() {
    this.engine.createObject({
      position: [0, 0]
    });
  },


  methods: {
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

