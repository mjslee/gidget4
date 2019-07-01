<template>
  <div v-if="typeof object.grabber === 'undefined'">
    <span :class="transitionClass" ref="label" :style="labelStyle" v-text="object.name"></span>
    <img :class="transitionClass" ref="object" :src="objectImage" :style="objectStyle" />
  </div>
</template>


<style scoped>
@keyframes spin {
  from { transform:rotate(0deg); }
  to { transform:rotate(360deg); }
}

span {
  color: white;
  background: rgba(0, 0, 0, 0.25);
  padding: 0.2rem;
  text-shadow: 1px 1px 1px #000;
  pointer-events: none;
}

img, span {
  position: absolute;
  cursor: pointer;
  transition: all 200ms;
}

.no-transition {
  transition: none;
}

.selected > span {
  z-index: 101 !important;
}

.selected > img {
  z-index: 100 !important;
  pointer-events: none;
  box-shadow: 0 0 3rem 1rem gold inset, 0 0 2rem goldenrod;
}
</style>


<script>
import { SPRITE_PATH } from '@/constants/paths'


export default {
  props: {
    object: Object,
    size: Number
  },


  data() {
    return {
      transitionClass: 'no-transition',
      scale: this.object.scale,

      objectLeft: 0,
      objectTop: 0,

      labelLeft: 0,
      labelTop: 0
    }
  },


  mounted() {
    this.updatePosition();
    setTimeout(() => this.transitionClass = '', 200);
  },


  computed: {
    /**
     * Calculate size of object.
     */
    tileSize() {
      return this.size * this.scale;
    },

    /**
     * Create label style object.
     */
    labelStyle() {
      return {
        'left': this.labelLeft + 'px',
        'top': this.labelTop + 'px',
        'z-index': this.object.layer + 2 || 0
      }
    },

    /**
     * Get width of label.
     */
    labelWidth() {
      return this.$refs.label.getBoundingClientRect().width;
    },

    /**
     * Get width of object.
     */
    objectWidth() {
      return this.$refs.object.getBoundingClientRect().width;
    },

    /**
     * Create object style object.
     */
    objectStyle() {
      return {
        'left': this.objectLeft + 'px',
        'top': this.objectTop + 'px',
        'height': this.tileSize + 'rem',
        'width': this.tileSize + 'rem',
        'z-index': this.object.layer || 0
      }
    },

    /**
     * Get image of object with prefix.
     */
    objectImage() {
      return SPRITE_PATH + this.object.image
    },
  },


  methods: {
    /**
     * Set GidgetObject's visual position inside page.
     * @param {number} x
     * @param {number} y
     */
    setAbsolutePosition(rect) {
      this.objectLeft = rect.x - (this.scale - 1) * rect.width / 2;
      this.objectTop = rect.y - (this.scale - 1) * rect.height;

      this.labelLeft = this.objectLeft + ((this.objectWidth - this.labelWidth) / 2);
      this.labelTop = this.objectTop - 25;
    },


    /**
     * Emit repositioning event.
     */
    updatePosition() {
      this.$emit('update:position', this);
    },
  },


  watch: {
    'object.position': {
      /**
       * Watch object's position to visually move in world.
       */
      handler() {
        this.updatePosition();
      },
      deep: true
    },

    'object.scale': {
      /**
       * Watch object's scale to visually move in world.
       */
      handler(newVal) {
        this.scale = newVal;
      }
    },

    'scale': {
      /**
       * Watch object's scale to visually move in world.
       */
      handler() {
        this.updatePosition();
      }
    },

    'size': {
      /**
       * Watch object's scale to visually move in world.
       */
      handler() {
        this.updatePosition();
      }
    }
  }
}
</script>
