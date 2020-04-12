<template>
  <div class="columns is-multi-line">
    <div class="column">
      <h1 class="title">World</h1>
      <world />
    </div>

    <div class="column">
      <div class="column">
        <h1 class="title">Settings</h1>
        <world-settings />
      </div>
      <div class="column" v-if="selectedObject">
        <h1 class="title">Selected Object</h1>
        <object-mover :object="selectedObject" />
      </div>
      <div class="column" v-if="selectedTile">
        <h1 class="title">Selected Tile</h1>
        <tile-editor />
      </div>
    </div>
  </div>
</template>


<script>
import World from '../World';
import WorldSettings from './WorldSettings';
import ObjectMover from '../Objects/ObjectMover';
import TileEditor from '../Tiles/TileEditor';


export default {
  components: {
    World,
    WorldSettings,
    ObjectMover,
    TileEditor
  },

  computed: {
    selectedObject() {
      return this.$store.getters['objects/getSelected'];
    },

    selectedTile() {
      return this.$store.getters['tiles/getSelected'];
    }
  }
};
</script>
