<template>
  <portal to="popover" v-if="active">
    <div class="popover box" :style="style">
      {{ variable }}
    </div>
  </portal>
</template>


<style scoped>
.popover {
  position: absolute;
  z-index: 999;
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
    variable: {
      type    : Object,
      default : () => ({
        identifier  : undefined,
        value       : undefined,
        type        : undefined,
      })
    },
    content: {
      type: String
    }
  },

  watch: {
    /**
     * Update popover position when attached element changes.
     */
    element() {
      if (this.element)
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

  data() {
    return {
      top  : 30,
      left : 30
    };
  },

  methods: {
    /**
     * Update position of popover element.
     *
     *
     * @return {void}
     */
    updatePosition() {
      if (typeof this.element == 'undefined')
        return;

      const $el = this.element.$el ? this.element.$el : this.element;
      const { top, left, bottom } = $el.getBoundingClientRect();
      this.top  = top + (bottom - top) + 10;
      this.left = left - 15;
    }
  }
}
</script>
