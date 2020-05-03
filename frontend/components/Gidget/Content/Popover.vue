<template>
  <article class="popover box notification">
    <button class="delete" @click="close"></button>

    <section>
      <slot></slot>
    </section>
  </article>
</template>


<style scoped>
.popover {
  position: absolute;
  min-width: 20rem;
  max-width: 30rem;
  z-index: 999;
}

.media-right {
  cursor: pointer;
}
</style>


<script>
import { createPopper } from '@popperjs/core';


export default {
  name: 'Popover',

  props: {
    parentElement: {
      type: Object | HTMLSpanElement,
    },
    active: {
      type: Boolean,
    }
  },
  
  watch: {
    /**
     * Close popover if popover id changes.
     *
     * @param {string} value
     * @return {void}
     */
    activePopover(value) {
      if (value != this.id)
        this.close();
    }
  },

  computed: {
    /**
     * Id of the active popover.
     *
     * @return {number}
     */
    activePopover() {
      return this.$store.state.global.popoverId;
    },

    /**
     * Find nested layer of this Popover by traversing upwards.
     * Only allows traversal of up to 100 nodes.
     *
     * @return {number}
     */
    layer() {
      let c = this.$parent;
      let depth = 0;

      // Only allow ascention of up to 100 nodes
      for (let i = 0; i < 100; i++) {
        if (!c)
          return;

        if (c._name == '<Popover>')
          depth++;

        else if (c._name != '<Value>' && c._name != '<Insight>')
          break;

        // Get next parent component
        c = c.$parent;
      }

      return depth;
    }
  },

  mounted() {
    // Initialize popper instance
    createPopper(this.parentElement, this.$el);

    // Nested popovers should be able to keep spawning...
    if (this.layer > 0)
      return;

    // First layer popovers should set a new active id to close any other
    // popovers on the same level.
    this.id = Math.random().toString().substring(2);
    this.$store.commit('global/setPopoverId', this.id);
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
