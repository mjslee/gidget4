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


export default {
  props: {
    value: String
  },

  beforeCreate: function () {
    this.valueComponent = require('./Value').default;
  },

  created() {
    Marked.setOptions({
      highlight(code, lang) {
        // No code? No highlighting required
        if (!code)
          return;

        // Highlight code
        const highlightedCode = hljs.highlight(lang, code);
        if (highlightedCode.value)
          return highlightedCode.value;
      }
    })
  },

  computed: {
    /**
     * Convert markdown to HTML using the 'marked' library.
     * Sanitize output HTML with DOMPurify.
     *
     * @return {string}
     */
    markdownHtml() {
      if (typeof this.value !== 'string')
        return '[error]';

      return DOMPurify.sanitize(Marked(this.value.replace(/```/g, '\n```')));
    },

    /**
     * Create dynamic component of markdown elements and Value components.
     *
     * @return {component}
     */
    component() {
      const template = '<Value value="$1" />';
      const pattern  = /\[\[(.*?)\]\]/gm;  // Captures [[TEXT_HERE]]
      const contents = this.markdownHtml.replace(pattern, template);

      return {
        components: { Value: this.valueComponent },
        template: '<div>' + contents + '</div>'
      };
    }
  }
}
</script>
