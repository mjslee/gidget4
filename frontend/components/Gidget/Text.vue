<template>
  <component class="gidget-text" :is="component"></component>
</template>


<style>
.gidget-text h1 {
  font-size: 2rem !important
}

</style>


<script>
import GidgetValue from './Value'
import Marked from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css';


export default {
  props: {
    text: String,
  },

  created() {
    Marked.setOptions({
      highlight(code, lang) {
        // No code? No highlighting required
        if (!code)
          return;

        // Highlight code
        const highlightedCode = hljs.highlight(lang, code)
        if (highlightedCode.value)
          return highlightedCode.value
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
      if (typeof this.text !== 'string')
        return '[error]';

      return DOMPurify.sanitize(Marked(this.text.replace(/```/g, '\n```')))
    },

    /**
     * Create dynamic component of markdown elements and GidgetValue components.
     *
     * @return {component}
     */
    component() {
      const template = '<GidgetValue code="$1" />'
      const pattern = /\[\[(.*?)\]\]/gm  // Captures [[TEXT_HERE]]
      const contents = this.markdownHtml.replace(pattern, template)

      return {
        components: { GidgetValue },
        template: '<div>' + contents + '</div>'
      }
    }
  }
}
</script>
