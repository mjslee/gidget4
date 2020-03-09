<template>
  <div>
    <codemirror ref="code" v-model="code" :options="codemirrorOptions" />
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

    activeLine:         Number,
    previousActiveLine: Number,

    errorLine:          Number,
    previousErrorLine:  Number
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
    }
  },


  data() {
    return {
      // Editor
      codemirrorOptions: {
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
