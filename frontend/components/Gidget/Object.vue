<template>
  <div :class="noTransitionClass" v-if="typeof object.grabber === 'undefined'">
    <span ref="message" :class="messageClass" :style="messageStyle" v-text="message" v-if="message"></span>
    <label ref="label" :style="labelStyle" v-text="object.name"></label>
    <img ref="object" :class="objectClass" :src="objectImage" :style="objectStyle" />
  </div>
</template>


<style scoped>

label {
  color: white;
  background: rgba(0, 0, 0, 0.25);
  padding: 0.2rem;
  text-shadow: 1px 1px 1px #000;
  pointer-events: none;
}

span {
  transition: none !important;
  color: yellow;
  font-weight: bold;
  text-shadow: 1px 1px 2px #000;
  opacity: 0;
}

img, label, span {
  position: absolute;
  cursor: pointer;
  transition: all 200ms;
}

.no-transition > * {
  transition: none;
}

.selected > label {
  z-index: 101 !important;
}

.selected > img {
  z-index: 100 !important;
  pointer-events: none;
  box-shadow: 0 0 3rem 1rem gold inset, 0 0 2rem goldenrod;
}

/* Transitions */
@keyframes spin {
  from { transform:rotate(0deg); }
  to { transform:rotate(360deg); }
}

.spin-transition {
  animation: spin linear 1000ms;
  animation-iteration-count: 1;
}

@keyframes new-message {
  0% { opacity: 1; transform: translate(0px, 60px); }
  80% { transform: translate(0px, 40px); }
  89% { opacity: 1; }
  90% { opacity: 0.9; }
  100% { opacity: 0; transform: translate(0px, 0px); }
}

.new-message-transition {
  animation: new-message linear 3s;
  animation-iteration-count: 1;
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
      messageClass: '',
      objectClass: '',
      noTransitionClass: 'no-transition',

      scale: this.object.scale,

      message: '',
      messageWidth: 0,
      messageLeft: 0,
      messageTop: 0,

      labelLeft: 0,
      labelTop: 0,

      objectLeft: 0,
      objectTop: 0,
    }
  },


  mounted() {
    this.updatePosition();
    setTimeout(() => this.noTransitionClass = '', 200);
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
      return this.size * this.scale;
    },

    /**
     * Create message style object.
     */
    messageStyle() {
      if (!this.message)
        return;

      return {
        'left': this.messageLeft + 'px',
        'top': this.messageTop + 'px',
        'z-index': this.object.layer + 3 || 0
      }
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
     * Get image of object with sprite path prefix.
     */
    objectImage() {
      return SPRITE_PATH + this.object.image
    },
  },


  methods: {
    /**
     * Set GidgetObject's visual position inside page.
     *
     * @param {object} rect
     */
    setPosition(rect) {
      this.objectLeft = rect.x - (this.scale - 1) * rect.width / 2;
      this.objectTop = rect.y - (this.scale - 1) * rect.height;

      this.calculateLabelPosition()
      this.calculateMessagePosition()
    },


    /**
     * Calculate position of object label.
     */
    calculateLabelPosition() {
      this.labelLeft = this.objectLeft + ((this.objectWidth - this.labelWidth) / 2);
      this.labelTop = this.objectTop - 25;
    },


    /**
     * Calculate position of object message.
     */
    calculateMessagePosition() {
      if (!this.$refs.message || !this.message)
        return;

      this.messageLeft = this.objectLeft + ((this.objectWidth - this.messageWidth) / 2);
      this.messageTop = this.objectTop - 50;
    },


    /**
     * Handle new message.
     */
    onNewMessage() {
      if (!this.message) {
        this.messageClass = ''
        return;
      }

      // Sometimes $refs.message does not exist
      if (!this.$refs.message)
        return

      // Slide up and fade transition
      this.messageClass = 'new-message-transition'

      // Calculate message width and then its position
      this.messageWidth = this.$refs.message.getBoundingClientRect().width
      this.calculateMessagePosition()
    },


    /**
     * Emit repositioning event.
     */
    updatePosition() {
      this.$emit('update:position', this);
    },
  },


  watch: {
    'object.transition': {
      /**
       * Watch object's message.
       */
      handler(newVal) {
        this.objectClass = newVal ? newVal + '-transition' : '';
      }
    },

    'object.message': {
      /**
       * Watch object's message.
       */
      handler(newVal) {
        this.message = newVal
        this.$nextTick(() => this.onNewMessage())
      }
    },

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
       * Watch object's inner scale.
       */
      handler() {
        this.updatePosition();
      }
    },

    'size': {
      /**
       * Watch object's inner size.
       */
      handler() {
        this.updatePosition();
      }
    }
  }
}
</script>
