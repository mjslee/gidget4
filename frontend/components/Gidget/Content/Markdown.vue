<template>
  <component class="gidget-text" :is="component" />
</template>


<style>
.gidget-text h1 {
  font-size: 2rem !important
}

</style>


<script>
import Marked from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

Marked.setOptions({
  highlight(code) {
    // No code? No highlighting required
    if (!code)
      return;

    // Highlight code
    const hl = hljs.highlightAuto(code);
    if (hl.value)
      return hl.value;
  }
});

export default {
  props: {
    value: String
  },

  beforeCreate: function () {
    this.valueComponent = require('./Value').default;
  },

  computed: {
    /**
     * Convert markdown to HTML using the 'marked' library.
     * Sanitize output HTML with DOMPurify.
     *
     * @return {string}
     */
    markdownHtml() {
      if (typeof this.value != 'string')
        return '[error]';

      return DOMPurify.sanitize(Marked(
        this.value
          .replace(/```/g, '\n```')  // Add new line before code block
          .replace(/<(.*?)>/g, '')  // Remove HTML tags
          .replace(/\[(.*?)\]\((.*?)\)/g, '')  // Remove links
      ));
    },

    /**
     * Create dynamic component of markdown elements and Value components.
     *
     * @return {component}
     */
    component() {
      const template = '<Value value="$1" />';
      const pattern  = /{{(.*?}?)}}/gm;  // Captures {{TEXT_HERE}}
      const contents = this.markdownHtml.replace(pattern, template);

      return {
        components: { Value: this.valueComponent },
        template: '<div>' + contents + '</div>'
      };
    }
  }
}
</script>
