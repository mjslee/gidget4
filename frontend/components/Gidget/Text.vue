<template>
  <component :is="component"></component>
</template>



<script>
import GidgetValue from './Value'
import DOMPurify from 'dompurify'
import Marked from 'marked'


export default {
  props: {
    text: String,
  },

  computed: {
    /**
     * Convert markdown to HTML using the 'marked' library.
     * Sanitize output HTML with DOMPurify.
     *
     * @return {string}
     */
    markdownHtml() {
      return DOMPurify.sanitize(Marked(this.text.replace(/```/g, '\n```')))
    },

    /**
     * Create dynamic component of markdown elements and GidgetValue components.
     *
     * @return {component}
     */
    component() {
      const template = '<GidgetValue literal="$1" />'
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
