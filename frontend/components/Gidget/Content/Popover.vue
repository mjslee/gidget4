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
export default {
  name: 'Popover',

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

  computed: {
    /*
     * Style attribute for popover element.
     */
    style() {
      return {
        top:  this.top  + 'px',
        left: this.left + 'px'
      };
    }
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
  }
}
</script>
