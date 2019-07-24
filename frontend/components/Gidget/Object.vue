<template>
  <div
    :style="style"
    :id="elementId"
    v-show="isGrabbed"
  >
    <!-- Message -->
    <span ref="message" :class="message ? 'new-message' : ''">
      {{ message }}
    </span>

    <!-- Name -->
    <label>{{ object.name }}</label>

    <!-- Sprite -->
    <img
      ref="sprite"
      class="gidget-sprite"
      :src="objectImage"
      :style="imageStyle"
    />
  </div>
</template>


<style scoped>
div {
  position: absolute;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 200ms;
}

label {
  display: inline-block;
  color: white;
  padding: 0.1rem 0.5rem;
  background: rgba(0, 0, 0, 0.25);
  text-align: center;
  text-shadow: 1px 1px 1px #000;
  pointer-events: none;
}

span {
  position: absolute;
  transition: none !important;
  color: yellow;
  font-weight: bold;
  text-shadow: 1px 1px 2px #000;
  opacity: 0;
}

.selected > label {
  z-index: 101 !important;
}

.selected > img {
  z-index: 100 !important;
  pointer-events: none;
  box-shadow: 0 0 3rem 1rem gold inset, 0 0 2rem goldenrod;
}

@keyframes new-message {
  0%   { opacity: 0 }
  10%  { opacity: 1; transform: translate(0, 3rem) }
  80%  { transform: translate(0, 1.5rem) }
  89%  { opacity: 1 }
  90%  { opacity: 0.9 }
  100% { opacity: 0; transform: translate(0, 0) }
}

.new-message {
  animation: new-message linear 3s;
  animation-iteration-count: 1;
}
</style>


<script>
import { SPRITE_PATH } from '@/constants/paths'
import { getObjectElementId, moveElementToTile } from '@/assets/gidget/game/gidget-utility'


export default {
  props: {
    object: Object,
    size: Number
  },


  data: () => ({
    message: ''
  }),


  mounted() {
    this.updatePosition();
    window.addEventListener('resize', this.updatePosition);
  },


  beforeDestroy() {
    // Clean up object when Vue reload happens
    if (this.object && this.object.onDestroy)
      this.object.onDestroy.call(this.object);
  },


  computed: {
    /**
     *
     */
    elementId() {
      return getObjectElementId(this.object)
    },

    /**
     * Calculate size of object.
     */
    tileSize() {
      return this.size * this.object.scale;
    },

    /**
     *
     */
    style() {
      return {
        'z-index': this.object.layer
      }
    },

    /**
     * Create object style object.
     */
    imageStyle() {
      return {
        'height': this.tileSize + 'rem',
        'width': this.tileSize + 'rem',
      }
    },

    /**
     * Get image of object with sprite path prefix.
     */
    objectImage() {
      return SPRITE_PATH + this.object.image
    },

    /**
     *
     */
    isGrabbed() {
      return typeof this.object.grabber == 'undefined'
    }
  },


  methods: {
    /**
     * Update GidgetObject's visual position inside page.
     *
     * @param {object} rect
     */
    updatePosition() {
      moveElementToTile(this.$el, this.object.position)
    }
  },


  watch: {
    /**
     * Update position on tile size change.
     */
    'size'() {
      this.updatePosition();
    },


    /**
     * Watch object's message.
     */
    'object.message'(newVal) {
      // Ignore empty/undefined values
      if (_.isEmpty(newVal))
        return

      // Set as undefined; watch will get triggered again
      // so we'll ignore it on the next go
      this.$nextTick(() => {
        this.object.message = undefined
      })

      // Set our internal message
      this.message = newVal

      // Restart new message animation (this is hack)
      const $el = this.$refs.message
      if (!$el)
        return

      $el.style.animation = 'none'
      $el.offsetHeight  // Reflow, this is the magic
      $el.style.animation = ''
    },


    /**
     * Watch object's position to visually move in world.
     */
    'object.position': {
      handler() {
        this.updatePosition()
      },
      deep: true
    },
  }
}
</script>
