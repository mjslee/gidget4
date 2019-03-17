<template>
  <main id="world" ref="world">

    <GidgetObject
      ref="objects"
      v-for="obj in worldObjects" :key="'obj-' + obj.id"
      @click.native="selectedObject = obj"
      :class="selectedObject && selectedObject.id === obj.id ? 'selected' : ''"
      :object="obj"
      :tiles="$refs['tiles']"
      :size="tileSize" />

    <div class="game-row x-axis">
      <label
        v-for="i in size" :key="'i-'+i"
        :style="axisLabelWidth" v-text="i-1" />
    </div>

    <div class="game-row" v-for="y in size" :key="'y-' +y">
      <label v-text="y-1"></label>
      <GidgetTile
        ref="tiles"
        v-for="x in size" :key="'x-' + x"
        @click.native="selectedObject = undefined"
        :class="getTileType(x-1, y-1)"
        :style="{ margin: tileMargin + 'rem' }"
        :size="tileSize"
        :x="x-1"
        :y="y-1" />
    </div>

  </main>
</template>


<style scoped>
#world {
  position: relative;
  overflow: visible;
}

.game-row {
  display: flex;
  align-items: center;
}

.x-axis {
  margin-left: 1rem;
}

label {
  text-align: center;
  font-size: 0.8rem;
  width: 1rem;
  color: #666;
}
</style>


<script>
import GidgetWorld from '../../assets/game/gidget-world'
import GidgetTile from './Tile'
import GidgetObject from './Object'


export default {
  components: {
    GidgetTile,
    GidgetObject
  },


  props: {
    size: Number,
    tiles: Array[Object],
    objects: Array[Object],
  },


  data() {
    return {
      tileSize: 5,
      tileMargin: .1,
      worldObjects: [],
      selectedObject: undefined
    }
  },


  created() {
    // Create copy of world
    this.world = Object.assign({}, GidgetWorld);
    this.worldObjects = this.world.objects;

    window.world = this.world;
  },


  mounted() {
    this.createObjects();
  },


  watch: {
    /**
     * Watch 'size' prop to resize the world size
     * @param {number} newValue
     * @param {number} oldValue
     */
    size(newValue, oldValue) {
      this.world.size = newValue;
    },

    selectedObject(newValue, oldValue) {
      this.$emit("update:selectedObject", newValue);
    }
  },


  computed: {
    /**
     * Calculate X axis label width.
     */
    axisLabelWidth() {
      return {
        width: this.tileSize + (this.tileMargin * 2) + 'rem'
      }
    }
  },


  methods: {
    /**
     * Get tile type at position.
     * @param {number} x
     * @param {number} y
     */
    getTileType(x, y) {
      const tile = this.tiles.find((tile) =>
        x === tile.position.x && y === tile.position.y
      );

      // Return tile type or default to grass
      return tile ? tile.type : "grass";
    },


    /**
     * Create objects in world.
     */
    createObjects() {
      for (var i = 0, len = this.objects.length; i < len; i++) {
        if (this.objects[i].isPlayer)
          this.world.createPlayer(this.objects[i]);
        else
          this.world.createObject(this.objects[i]);
      }
    },
  },
}
</script>

