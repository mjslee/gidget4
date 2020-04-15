<template>
  <main ref="world" id="world" v-if="size">
    <!-- Horizontal Axis Labels (1, 2, 3, etc.) -->
    <div class="game-row x-axis">
      <label
        v-for="(i, x) in size.width"
        :key="'x-' + x"
        :style="axisLabelStyle"
        :class="hovered.x == x ? 'active': ''"
        v-text="x"
      />
    </div>

    <div class="game-row y-axis" v-for="(i, y) in size.height" :key="'y-' + y">
      <!-- Vertical Axis Labels (1, 2, 3, etc.) -->
      <label v-text="y" :class="hovered.y === y ? 'active': ''" />

      <!-- Gidget Game Tiles -->
      <gidget-tile
        @mouseenter.native="hoverTile(x, y)"
        :position="{ x, y }"
        :size="tileSize"
        :margin="tileMargin"
        :key="`${x},${y}`"
        :ref="`tile-${x},${y}`"
        v-for="(i, x) in size.width"
      />
    </div>

    <!-- Gidget Game Objects -->
    <gidget-object
      ref="objects"
      v-for="object in objects"
      :key="'obj-' + object.id"
      :object="object"
      :size="tileSize"
      :margin="tileMargin"
      @mouseenter.native="hoverTile(...object.position)"
      @move="moveObjectElement"
    />

  </main>
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

  mounted() {
    this.moveObjectElements();
    window.addEventListener('resize', this.moveObjectElements);

    // Watch for mutations of things that would affect object positions
    this.$watch((vm) => (vm.size, vm.tileSize), this.moveObjectElements);
  },


  data() {
    return {
      hovered: { x: 0, y: 0 },
      tileMargin: 0.1
    }
  },


  computed: {
    /**
     * World size.
     *
     * @return {object[height,width]}
     */
    size() {
      return this.$store.getters['game/getWorldSize'];
    },

    /**
     * Tile size.
     *
     * @return {number}
     */
    tileSize() {
      if (!this.size)
        return -1;

      return 26 / Math.max(this.size.width, this.size.height);
    },

    /**
     * Calculate X axis label width.
     *
     * @return {object}
     */
    axisLabelStyle() {
      return { width: this.tileSize + (this.tileMargin * 2) + 'rem' };
    },

    /**
     * Game objects from objects store.
     *
     * @return {array}
     */
    objects() {
      return this.$store.getters['objects/getObjects'];
    },

    /**
     * Game tiles from tiles store.
     *
     * @return {array}
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

    /**
     * Move an object's element to the same screen position as a tile's element.
     *
     * @param {object} component - Vue component to move.
     * @return {void}
     */
    moveObjectElement(component) {
      // Get tile component by its reference.
      const { x, y } = component.object.position;
      const tiles = this.$refs[`tile-${x},${y}`];
      if (!tiles[0] || !component)
        return;

      // Get elements of components
      const $el = component.$el;
      const $tile = tiles[0].$el;

      if (!$tile || !$el)
        return;

      // Set position
      component.top = $tile.offsetTop - ($el.scrollHeight - $tile.scrollHeight);
      component.left = $tile.offsetLeft - (($el.scrollWidth - $tile.scrollWidth) / 2);
    },

    /**
     * Move all objects to their screen positions.
     * Runs on next tick so it happens after everything is done changing.
     *
     * @return {void}
     */
    moveObjectElements() {
      if (!this.$refs.objects)
        return;

      this.$nextTick(() => {
        this.$refs.objects.forEach((obj) => {
          this.moveObjectElement(obj);
        });
      });
    }
  }
}
</script>
