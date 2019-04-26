<template>
  <div>
    <span :style="labelStyle" v-text="this.object.name"></span>
    <img :src="object.image" :style="objectStyle" />
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
}

img, span {
  position: absolute;
  cursor: pointer;
  transition: all 200ms;
}

.selected > img {
  z-index: 1000 !important;
  pointer-events: none;
  box-shadow: 0 0 3rem 1rem gold inset, 0 0 2rem goldenrod;
}
</style>


<script>
export default {
  props: {
    object: Object,
    size: Number
  },


  data() {
    return {
      scale: this.object.scale,

      objectLeft: 0,
      objectTop: 0,

      labelLeft: 0,
      labelTop: 0
    }
  },


  mounted() {
    //this.object.vueComponent = this;
  },


  computed: {
    /**
     * Calculate size of object.
     */
    getSize() {
      return this.size * this.scale + 'rem';
    },

    /**
     *
     */
    labelStyle() {
      return {
        'left': this.labelLeft + 'px',
        'top': this.labelTop + 'px',
        'z-index': this.object.layer + 2 || 0
      }
    },

    /**
     *
     */
    objectStyle() {
      return {
        'left': this.objectLeft + 'px',
        'top': this.objectTop + 'px',
        'height': this.getSize,
        'width': this.getSize,
        'z-index': this.object.layer || 0
      }
    }
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

      this.labelLeft = rect.x - (this.scale - 1) * rect.width / 2;
      this.labelTop = rect.y - (this.scale - 1) * rect.height;
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
