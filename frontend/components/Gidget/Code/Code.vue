<template>
  <codemirror ref="code" v-model="code" :options="options" />
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

  watch: {
    /**
     * Watch activeLine property of code store.
     *
     * @return {void}
     */
    '$store.state.code.activeLine'(ln) {
      this.setLineClass(ln, this.prevActiveLine, this.activeLineClass);
      this.prevActiveLine = this.$store.state.code.activeLine;
    },

    /**
     * Watch errorLine property of code store.
     *
     * @return {void}
     */
    '$store.state.code.errorLine'(ln) {
      this.setLineClass(ln, this.prevErrorLine, this.errorLineClass);
      this.prevErrorLine = this.$store.state.code.errorLine;
    },
  },

  computed: {
    /**
     * CodeMirror editor component reference.
     *
     * @return {object}
     */
    editor() {
      return this.$refs.code.codemirror;
    },

    /**
     * Get or set code value in code store.
     *
     * @param {string}
     * @return {string}
     */
    code: {
      get() {
        return this.$store.state.code.value;
      },
      set(value) {
        this.$store.commit('code/setValue', value);
      }
    },
  },

  data() {
    return {
      // Editor
      options: {
        tabSize     : 2,
        line        : true,
        lineNumbers : true,
      },

      // Previous line numbers
      prevActiveLine : -1,
      prevErrorLine  : -1,

      // Classes for lines
      where: 'background',
      activeLineClass : 'CodeMirror-activeline-background',
      errorLineClass  : 'CodeMirror-errorline-background',
    };
  },

  methods: {
    /**
     * Set class of a line by its number.
     *
     * @param {number} ln - Line number.
     * @param {number} prevLn - Previous line number.
     * @param {string} className - Name of class to add or remove.
     * @return {void}
     */
    setLineClass(ln, prevLn, className) {
      this.editor.removeLineClass(prevLn, this.where, className);
      this.editor.addLineClass(ln, this.where, className);
    }
  }
}
</script>
