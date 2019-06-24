<template>
  <div>
    <div
      class="position-popup"
      :style="popupPosition"
      v-text="`[${hoveredTile.x}, ${hoveredTile.y}]`"
    />

    <main ref="world" id="world"
      @mouseenter="popupPosition.display = 'block'"
      @mouseleave="popupPosition.display = 'none'"
      @mousemove="movePopupPosition"
    >
      <!-- Gidget Game Objects -->
      <GidgetObject
        ref="objects"
        v-for="object in objects" :key="'obj-' + object.id"
        @click.native="selectedObject = object"
        @update:position="updateObjectPosition"
        :class="selectedObject && selectedObject.id === object.id ? 'selected' : ''"
        :object="object"
        :size="tileSize"
      />

      <!-- Horizontal Axis Labels (1, 2, 3, etc.) -->
      <div class="game-row x-axis">
        <label
          v-for="i in size" :key="'i-'+i"
          :style="axisLabelWidth" v-text="i-1"
        />
      </div>

      <div class="game-row" v-for="y in size" :key="'y-' +y">
        <!-- Vertical Axis Labels (1, 2, 3, etc.) -->
        <label v-text="y-1" />

        <!-- Gidget Game Tiles -->
        <GidgetTile
          ref="tiles"
          v-for="x in size" :key="'x-' + x"
          @click.native="selectedObject = undefined"
          @mouseenter.native="setPopupPosition(x-1, y-1)"
          :class="getTileType(x-1, y-1)"
          :style="tileStyle"
          :size="tileSize"
          :x="x-1"
          :y="y-1"
        />
      </div>

    </main>
  </div>
</template>


<style scoped>
#world {
  display: inline-block;
  overflow: none;
}

.game-row {
  display: flex;
  align-items: center;
}

.x-axis {
  margin-left: 1rem;
}

.position-popup {
  z-index: 1001;
  position: absolute;
  pointer-events: none;
  padding: 0.3rem;
  text-shadow: 1px 1px 2px #000;
  background: rgba(0, 0, 0, 0.25);
  color: white;
}

label {
  text-align: center;
  font-size: 0.8rem;
  width: 1rem;
  color: #666;
}
</style>


<script>
import GidgetTile from './Tile'
import GidgetObject from './Object'


export default {
  components: {
    GidgetTile,
    GidgetObject
  },


  props: {
    objects: Array,
    tiles: Array[Object],
    size: Number,
  },


  data() {
    return {
      popupPosition: { top: 0, left: 0, display: 'none' },
      hoveredTile: { x: 0, y: 0 },

      tileMargin: .1,
      selectedObject: undefined,
    }
  },


  mounted() {
    window.addEventListener('resize', this.updateObjectPositions);
    this.updateObjectPositions();
  },


  watch: {
    /**
     * Watch 'size' prop to resize the world size
     * @param {number} newValue
     */
    size: {
      handler() {
        this.$nextTick(() => {
          this.updateObjectPositions();
        });
      }
    },

    /**
     * Emit selected object update.
     * @param {number} newValue
     */
    selectedObject(newValue) {
      this.$emit("change:object", newValue);
    }
  },


  computed: {
    /**
     * Tile size.
     */
    tileSize() {
      return 26 / this.size;
    },

    /**
     * Tile style.
     */
    tileStyle() {
      return {
        margin: this.tileMargin + 'rem'
      }
    },

    /**
     * Calculate X axis label width.
     */
    axisLabelWidth() {
      return {
        width: this.tileSize + (this.tileMargin * 2) + 'rem'
      }
    },
  },


  methods: {
    /**
     * Get tile type at position.
     * @param {number} x
     * @param {number} y
     */
    getTileType(x, y) {
      const tile = this.tiles.find(tile =>
        x === tile.position.x && y === tile.position.y
      );

      // Return tile type or default to grass
      return tile ? tile.type : "grass";
    },


    /**
     * Get visual offset of a Tile's DOM element.
     * @param {number} x
     * @param {number} y
     */
    getTileRect(x, y) {
      const tile = this.$refs.tiles.find(tile => tile.x === x && tile.y === y);
      return !tile ? undefined : {
        x: tile.$el.offsetLeft, y: tile.$el.offsetTop,
        height: tile.$el.offsetHeight, width: tile.$el.offsetWidth
      };
    },

    /**
     * Set a GidgetObject's absolute position.
     * @param {object} object
     */
    updateObjectPosition(object) {
      const position = object.object.position;
      const rect = this.getTileRect(position.x, position.y);

      if (rect)
        object.setAbsolutePosition(rect);
    },

    /**
     * Update all object positions in world.
     */
    updateObjectPositions() {
      if (!this.$refs.objects)
        return;

      this.$refs.objects.forEach(object => {
        this.updateObjectPosition(object);
      });
    },

    /*
     * Set absolute position of floating coordinates.
     * @param {object} event
     */
    movePopupPosition(event) {
      this.popupPosition.left = (event.pageX + 25) + 'px';
      this.popupPosition.top = (event.pageY - 150) + 'px';
    },

    /*
     * Set floating coordinates tile position.
     * @param {number} x
     * @param {number} y
     */
    setPopupPosition(x, y) {
      this.hoveredTile.x = x;
      this.hoveredTile.y = y;
    }
  }
}
</script>
