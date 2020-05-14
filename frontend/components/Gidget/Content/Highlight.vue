<template>
  <span v-html="highlightedValue" />
</template>

<script>
import hljs from 'highlight.js';

export default {
  name: 'Highlight',

  props: {
    value: Array | Object | String | Boolean | Number
  },

  computed: {
    /**
     * Use highlight.js for syntax highlighting.
     *
     * return {string}
     */
    highlightedValue() {
      let value = this.value;

      // Stringify non-strings
      if (typeof value != 'string') {
        try   { value = JSON.stringify(value); }
        catch { return '[circ]'; }
      }

      return hljs.highlight('javascript', value || 'undefined').value;
    }
  }
}
</script>
