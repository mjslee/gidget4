<template>
  <div>
    <codemirror
      ref="code"
      :value="code"
      :options="codemirrorOptions"
      @input="onInput" />
  </div>
</template>


<style>
.CodeMirror-errorline-background {
  background: #ffe8e8 !important;
}
</style>


<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'


export default {
  components: {
    codemirror
  },


  props: {
    value: String
  },


  watch: {
    /**
     * Update code on value change.
     */
    value(newVal) {
      this.code = newVal;
    }
  },


  data() {
    return {
      // Editor
      code: this.value,
      codemirrorOptions: {
        tabSize: 2,
        line: true,
        lineNumbers: true,
      },

      // Classes for lines
      activeLineClass: 'CodeMirror-activeline-background',
      errorLineClass: 'CodeMirror-errorline-background',

      // Line number cache
      prevLn: -1,
      prevErrorLn: -1
    }
  },


  mounted() {
    this.codemirror = this.$refs.code.codemirror;
  },


  methods: {
    /**
     * Update component's code property.
     *
     * @return {void}
     */
    onInput(value) {
      this.code = value;
    },


    /**
     * Reset all line classes.
     *
     * @return {void}
     */
    reset() {
      this.setActiveLine(-1);
      this.setErrorLine(-1);
    },


    /**
     * Set class of a line by its number.
     *
     * @param {number} ln -- Line number.
     * @param {number} prevLn -- Previous line number.
     * @param {string} type -- Can be: 'text', 'background', or 'wrap'
     * @param {string} className -- Name of class to add or remove.
     * @return {void}
     */
    setLineClass(ln, prevLn, type, className) {
      // Remove previous line's indicator
      if (prevLn > -1)
        this.codemirror.removeLineClass(prevLn, type, className)

      // Add class to indicate line
      if (ln > -1)
        this.codemirror.addLineClass(ln, type, className)
    },


    /**
     * Set the active line's visual indicator.
     *
     * @param {number} ln -- Line number.
     * @return {void}
     */
    setActiveLine(ln) {
      this.setLineClass(ln, this.prevLn, 'background', this.activeLineClass)
      this.prevLn = ln;
    },


    /**
     * Set line indicator for an error.
     *
     * @param {number} ln -- Line number.
     * @return {void}
     */
    setErrorLine(ln) {
      this.setLineClass(ln, this.prevErrorLn, 'background', this.errorLineClass)
      this.prevErrorLn = ln;
    },
  }
}
</script>
