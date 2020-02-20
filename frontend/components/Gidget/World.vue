<template>
  <div>
    <!-- <div -->
    <!--   :style="popupPosition" -->
    <!--   v&#45;text="`[${hoveredTile.x}, ${hoveredTile.y}]`" -->
    <!--   class="position&#45;popup" -->
    <!--   @mouseenter="popupPosition.display = 'block'" -->
    <!--   @mouseleave="popupPosition.display = 'none'" -->
    <!--   @mousemove="movePopupPosition" -->
    <!-- /> -->

    <main ref="world" id="world">
      <!-- Gidget Game Objects -->
      <GidgetObject
        @click.native="$emit('click:object', object)"
        :object="object"
        :size="tileSize"
        :key="'obj-' + object.id"
        v-for="object in objects"
      />

      <!-- Horizontal Axis Labels (1, 2, 3, etc.) -->
      <div class="game-row x-axis">
        <label
          :style="axisLabelStyle"
          :class="hoveredTile.x == x ? 'active': ''"
          :key="'x-' + x"
          v-for="(i, x) in size"
          v-text="x"
        />
      </div>

      <div class="game-row y-axis" v-for="(i, y) in size" :key="'y-' + y">
        <!-- Vertical Axis Labels (1, 2, 3, etc.) -->
        <label v-text="y" :class="hoveredTile.y === y ? 'active': ''" />

        <!-- Gidget Game Tiles -->
        <GidgetTile
          @click.native="clickTile(x, y)"
          @mouseenter.native="hoverTile(x, y)"
          :type="tileTypes[x + ',' + y]"
          :style="tileStyle"
          :size="tileSize"
          :x="x"
          :y="y"
          :key="'x-' + x + '-y-' + y"
          v-for="(i, x) in size"
          ref="tiles"
        />
      </div>

    </main>
  </div>
</template>


<style scoped>
#world {
  display: inline-block;
  overflow: none;
  user-select: none;
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
  color: #888;
}

label.active {
  color: black;
  font-weight: bold;
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
    editMode: {
      type: Boolean,
      default: false
    }
  },


  data() {
    return {
      popupPosition: {
        top: 0,
        left: 0,
        display: 'none'
      },
      hoveredTile: {
        x: 0,
        y: 0
      },
      tileTypes: {},
      tileMargin: .1,
      selectedObject: undefined,
    }
  },

  watch: {
    /**
     * Watch 'size' prop to resize the world size
     * @param {number} newValue
     */
    size: {
      handler() {
        console.log('updated');
        this.$nextTick(() => {
          //this.updateObjectPositions();
        });
      }
    },

    /**
     * 
     *
     */
    tiles: {
      immediate: true,
      handler(val) {
        // Generate tile classes
        this.tiles.forEach((tile) => {
          if (typeof tile != 'object')
            return;

          const pos = tile.position;
          this.tileTypes[pos.x + ',' + pos.y] = tile.type;
        });
      }
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
      };
    },

    /**
     * Calculate X axis label width.
     */
    axisLabelStyle() {
      return {
        width: this.tileSize + (this.tileMargin * 2) + 'rem'
      };
    },
  },


  methods: {
    /**
     * Get tile type at position.
     *
     * @param {number} x
     * @param {number} y
     * @return {void}
     */
    getTileType(x, y) {
      const tile = this.tiles.find((tile) => {
        return x == tile.position.x && y == tile.position.y;
      });

      // Return tile type or default to grass
      return tile ? tile.type : 'grass';
    },

    /**
     *
     * @param {number} x
     * @param {number} y
     * @return {void}
     */
    clickTile(x, y) {
      console.log(x, y);
    },

    /*
     * Set floating coordinates tile position.
     *
     * @param {number} x
     * @param {number} y
     * @return {void}
     */
    hoverTile(x, y) {
      this.hoveredTile.x = x;
      this.hoveredTile.y = y;
    }
  }
}
</script>
