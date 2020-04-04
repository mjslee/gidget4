<template>
  <div>
    <main ref="world" id="world">
      <!-- Gidget Game Objects -->
      <gidget-object
        @mouseenter.native="hoverTile(object.position.x, object.position.y)"
        :object="object"
        :size="tileSize"
        :margin="tileMargin"
        :key="'obj-' + object.id"
        v-for="object in objects"
      />

      <!-- Horizontal Axis Labels (1, 2, 3, etc.) -->
      <div class="game-row x-axis">
        <label
          :style="axisLabelStyle"
          :class="hovered.x == x ? 'active': ''"
          :key="'x-' + x"
          v-for="(i, x) in size"
          v-text="x"
        />
      </div>

      <div class="game-row y-axis" v-for="(i, y) in size" :key="'y-' + y">
        <!-- Vertical Axis Labels (1, 2, 3, etc.) -->
        <label v-text="y" :class="hovered.y === y ? 'active': ''" />

        <!-- Gidget Game Tiles -->
        <GidgetTile
          @mouseenter.native="hoverTile(x, y)"
          :position="{ x, y }"
          :size="tileSize"
          :margin="tileMargin"
          :key="`${x},${y}`"
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
import GidgetTile from './Tiles/Tile'
import GidgetObject from './Objects/Object'


export default {
  components: {
    GidgetTile,
    GidgetObject
  },


  data() {
    return {
      hovered: { x: 0, y: 0 },
      tileMargin: 0.1
    }
  },


  watch: {
    /**
     * Watch 'size' prop to resize the world size
     * @param {number} newValue
     */
    size: {
      handler() {
        this.$nextTick(() => {
          //this.updateObjectPositions();
        });
      }
    },
  },


  computed: {
    /**
     * Tile size.
     */
    tileSize() {
      return 26 / this.size;
    },

    /**
     * Calculate X axis label width.
     */
    axisLabelStyle() {
      return {
        width: this.tileSize + (this.tileMargin * 2) + 'rem'
      };
    },

    /**
     *
     */
    size() {
      return this.$store.getters['game/getWorldSize'];
    },

    /**
     *
     */
    objects() {
      return this.$store.getters['objects/getObjects'];
    },

    /**
     *
     */
    tiles() {
      return this.$store.getters['game/getTiles'];
    },
  },


  methods: {
    /*
     * Set floating coordinates tile position.
     *
     * @param {number} x
     * @param {number} y
     * @return {void}
     */
    hoverTile(x, y) {
      this.hovered.x = x;
      this.hovered.y = y;
    },
  }
}
</script>
