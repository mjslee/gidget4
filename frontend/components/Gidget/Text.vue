<template>
  <component :is="component"></component>
</template>


<script>
import GidgetValue from './Value'
import marked from 'marked'


export default {
  props: {
    text: String,
  },

  computed: {
    /**
     * Convert markdown to HTML using the 'marked' library.
     * Also sanitize potentially harmful input text.
     * - Removes script tags
     * - Removes HTML attribute values with 'javascript:TEXT_HERE'
     *
     * @return {string}
     */
    markdownHtml() {
      return marked(
        this.text
          .replace(/\<script.*?\<\/script\>/gmi, '')
          .replace(/[\W]javascript:.*?>/gmi, '>')
      )
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
