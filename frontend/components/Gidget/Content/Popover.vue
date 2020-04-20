<template>
  <portal to="popover" v-if="active">
    <article ref="popover" class="popover box" :style="style">
      <section class="media">
        <div class="media-content">
          <slot></slot>
        </div>
        <div class="media-right" @click="close">
          <b-icon icon="close" size="is-small" />
        </div>
      </section>
    </article>
  </portal>
</template>


<style scoped>
.popover {
  min-width: 20rem;
  position: absolute;
  z-index: 999;
}

.media-right {
  cursor: pointer;
}
</style>


<script>
import Text from './Text';

export default {
  name: 'Popover',

  components: {
    'gidget-text': Text
  },

  props: {
    element: {
      type: Object | HTMLSpanElement,
    },
    active: {
      type: Boolean,
    },
    tokens: {
      type: Array,
    },
    value: {
      type: Number | String | Boolean | Array | Object,
    },
    text: {
      type: String
    }
  },

  watch: {
    /**
     * Update popover position when attached element changes.
     */
    active() {
      this.updatePosition();
    },

    /**
     * Update popover position when attached element changes.
     */
    element() {
      this.updatePosition();
    }
  },

  computed: {
    /*
     * Style attribute for popover element.
     */
    style() {
      return {
        top  : this.top  + 'px',
        left : this.left + 'px'
      };
    }
  },

  mounted() {
    this.updatePosition();
  },

  data() {
    return {
      top  : 30,
      left : 30
    };
  },

  methods: {
    /**
     * Close popover box.
     *
     * @return {void}
     */
    close() {
      this.$emit('update:active', false);
    },

    /**
     * Update position of popover element.
     *
     *
     * @return {void}
     */
    updatePosition() {
      if (!this.element)
        return;

      // Boundaries of element that popover is attached to
      const { left, bottom } = this.element.getBoundingClientRect();

      // Set position
      this.top  = bottom + 10;
      this.left = left - 15;

      // Ensure position is within client width
      // if ((this.left + this.$el.offsetWidth) > this.innerWidth) {
      //   this.left -= (this.left - this.inner);
      // }
    }
  }
}
</script>
