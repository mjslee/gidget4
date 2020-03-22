<template>
  <div>
    <codemirror ref="code" v-model="code" :options="options" />
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
    value: String,
  },


  watch: {
    /**
     * Update code on value change.
     */
    activeLine(ln) {
      this.setLineClass(ln, this.previousActiveLine, this.activeLineClass);
    },


    /**
     *
     */
    errorLine(ln) {
      this.setLineClass(ln, this.previousErrorLine, this.errorLineClass);
    },
  },

  computed: {
    /**
     *
     */
    code: {
      get() {
        return this.value;
      },
      set(value) {
        return this.$emit('input', value);
      }
    },

    /**
     * Active line number.
     *
     * @return {number}
     */
    activeLine() {
      return this.$store.state.game.activeLine;
    },

    /**
     * Line number of previously active line.
     *
     * @return {number}
     */
    previousActiveLine() {
      return this.$store.state.game.previousActiveLine;
    },

    /**
     * Line number with error.
     *
     * @return {number}
     */
    errorLine() {
      return this.$store.state.game.errorLine;
    },

    /**
     * Line number of the previous error line.
     *
     * @return {number}
     */
    previousErrorLine() {
      return this.$store.state.game.previousErrorLine;
    },
  },


  data() {
    return {
      // Editor
      options: {
        tabSize:     2,
        line:        true,
        lineNumbers: true,
      },

      // Classes for lines
      activeLineClass: 'CodeMirror-activeline-background',
      errorLineClass:  'CodeMirror-errorline-background',
    };
  },


  mounted() {
    this.codemirror = this.$refs.code.codemirror;
  },


  methods: {
    /**
     * Set class of a line by its number.
     *
     * @param {number} ln -- Line number.
     * @param {number} prevLn -- Previous line number.
     * @param {string} className -- Name of class to add or remove.
     * @param {string} type -- Can be: 'text', 'background', or 'wrap'
     * @return {void}
     */
    setLineClass(ln, prevLn, className, type='background') {
      // Remove previous line's indicator
      if (prevLn > -1)
        this.codemirror.removeLineClass(prevLn, type, className);

      // Add class to indicate line
      if (ln > -1)
        this.codemirror.addLineClass(ln, type, className);
    },
  }
}
</script>
