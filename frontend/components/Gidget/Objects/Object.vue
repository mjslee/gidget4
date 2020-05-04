<template>
  <div
    :style="elementStyle"
    :class="elementClass"
    v-show="isNotGrabbed"
    @click="select"
  >
    <!-- Message -->
    <span class="gidget-message" ref="message" :class="message ? 'new-message' : ''">
      {{ message }}
    </span>

    <!-- Name -->
    <span class="gidget-name">
      {{ object.name }}{{ indexText }}
    </span>

    <!-- Sprite -->
    <img class="gidget-sprite" :src="spriteSrc" :style="spriteStyle" />
  </div>
</template>


<style scoped>
div {
  position: absolute;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 250ms;
}

.gidget-name {
  display: inline-block;
  color: white;
  padding: 0.1rem 0.5rem;
  background: rgba(0, 0, 0, 0.25);
  text-align: center;
  text-shadow: 1px 1px 1px #000;
  pointer-events: none;
  transform: translate(0, 20%);
}

.gidget-message {
  position: absolute;
  transition: none !important;
  color: yellow;
  font-weight: bold;
  text-shadow: 1px 1px 2px #000;
  opacity: 0;
}

.selected > .gidget-name {
  z-index: 101 !important;
}

.selected > .gidget-sprite {
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

.no-transitions {
  transition: none !important;
}
</style>


<script>
import { ObjectSprite } from '@/constants/sprites';
import { getObjectElementId } from '@/assets/gidget/game/gidget-utility';


export default {
  props: {
    size        : Number,
    margin      : Number,
    selected    : Boolean,
    transitions : Boolean,

    object      : Object,
  },


  data() {
    return {
      message: '',
      top: 0,
      left: 0
    }
  },

  mounted() {
    this.object.getElement = () => this.$el;
    this.$emit('move', this);
  },


  beforeDestroy() {
    // Clean up object when Vue reload happens
    if (this.object && this.object.onDestroy)
      this.object.onDestroy.call(this.object);
  },


  computed: {
    /**
     * Calculate size of object.
     */
    tileSize() {
      return this.size * this.object.scale;
    },

    /**
     * Style properties for parent element.
     *
     * @return {object}
     */
    elementStyle() {
      return {
        'margin'  : this.margin + 'rem',
        'z-index' : this.object.layer,
        'top'     : this.top + 'px',
        'left'    : this.left + 'px'
      }
    },

    /**
     * Classes for parent element.
     *
     * @return {string}
     */
    elementClass() {
      if (!this.transitions)
        return 'no-transitions';

      if (this.$store.state.objects.selected == this.object.id)
        return 'selected';
    },

    /**
     * Text representation of the object's index.
     *
     * @return {string}
     */
    indexText() {
      if (typeof this.object.index == 'number')
        return `[${this.object.index}]`;
    },

    /**
     * Create object style object.
     *
     * @return {object}
     */
    spriteStyle() {
      return {
        'height' : this.tileSize + 'rem',
        'width'  : this.tileSize + 'rem',
      }
    },

    /**
     * Get URL of game sprite.
     *
     * @return {string}
     */
    spriteSrc() {
      return ObjectSprite(this.object.sprite);
    },

    /**
     * Is the object grabbed by another object?
     *
     * @return {boolean}
     */
    isNotGrabbed() {
      return typeof this.object.grabber == 'undefined';
    },
  },


  methods: {
    /**
     * Update GidgetObject's visual position inside page.
     *
     * @return {void}
     */
    updatePosition() {
      this.$nextTick(() => this.$emit('move', this));
    },

    /**
     * Set object as selected and unselect tile.
     *
     * @return {void}
     */
    select() {
      this.$store.commit('objects/setSelected', this.object.id);
      this.$store.commit('tiles/setSelected', undefined);
    }
  },


  watch: {
    /**
     * Watch object's position to visually move in world.
     */
    'object.position': {
      handler(value) {
        this.updatePosition();
      },
      deep: true
    },

    /**
     * Update position on scale change.
     */
    'object.scale'() {
      this.updatePosition();
    },

    /**
     * Watch object's message.
     */
    'object.message'(newVal) {
      // Ignore empty/undefined values
      if (!document.hasFocus() || typeof newVal != 'string' || newVal.length < 1)
        return;

      // Set as undefined; watch will get triggered again
      // so we'll ignore it on the next go
      this.$nextTick(() => {
        this.object.message = undefined;
      });

      // Set our internal message
      this.message = newVal;

      // Restart new message animation (this is hack)
      const $el = this.$refs.message;
      if (typeof $el == 'undefined')
        return;

      $el.style.animation = 'none';
      $el.offsetHeight;  // Reflow, this is the magic
      $el.style.animation = '';
    },
  }
}
</script>
