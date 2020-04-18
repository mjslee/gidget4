<template>
  <portal to="popover" v-if="active && element">
    <div class="popover box" :style="style">
      <gidget-text value="" />
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
    element: Object | HTMLSpanElement,
    active: {
      type    : Boolean,
      default : false
    },
    variable: {
      type    : Object,
      default : () => ({
        identifier : undefined,
        value      : undefined,
        type       : undefined,
      })
    },
    content: {
      type    : String,
      default : undefined
    }
  },

  computed: {
    style() {
      return {
        top  : this.top  + 'px',
        left : this.left + 'px'
      };
    }
  },

  mounted() {
    this.setPosition();
  },

  data() {
    return {
      top  : 30,
      left : 30
    };
  },

  methods: {
    setPosition() {
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
