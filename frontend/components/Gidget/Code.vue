<template>
  <div>
    <codemirror
      ref="code"
      :value="code"
      :options="codemirrorOptions"
      @input="onInput" />
  </div>
</template>


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
        lineNumbers: true,
        line: true,

        gutters: ['breakpoints', 'error', 'active', 'next']
      },

      // Lines
      activeLine: null,
      nextLine: null,
      errorLine: null,
      previousLines: {}
    }
  },

  mounted() {
    this.codemirror = this.$refs.code.codemirror;

    // Create active line element
    this.activeLine = document.createElement('div');
    this.activeLine.innerHTML = '🡆';
    this.activeLine.style.color = 'rgb(201, 230, 202)';

    // Create next line element
    this.nextLine = document.createElement('div');
    this.nextLine.innerHTML = '🡆';
    this.nextLine.style.color = 'red';

    // Create error line element
    this.errorLine = document.createElement('div');
    this.errorLine.innerHTML = '🡆';
    this.errorLine.style.color = 'black';
  },


  methods: {
    /**
     * Update component's code property.
     */
    onInput(value) {
      this.code = value;
    },


    /**
     *
     */
    reset() {
      this.setErrorLine(-1);
      this.setActiveLine(-1);
      this.setNextLine(-1);
    },

    /**
     * Set a line's gutter to an element.
     */
    setLine(ln, key, element) {
      // Only set when line exists
      if (ln > -1)
        this.codemirror.setGutterMarker(ln, key, element);

      // Remove previous indicator
      if (typeof this.previousLines[key] !== 'undefined')
        this.codemirror.setGutterMarker(this.previousLines[key], key, null);

      // Save previous line so we can remove it later
      this.previousLines[key] = ln;
    },

    /**
     * Set 'active' gutter in codemirror.
     */
    setActiveLine(ln) {
      this.setLine(ln, 'active', this.activeLine);
    },

    /**
     * Set 'next' gutter in codemirror.
     */
    setNextLine(ln) {
      this.setLine(ln, 'next', this.nextLine);
    },

    /**
     * Set 'error' gutter in codemirror.
     */
    setErrorLine(ln) {
      this.setLine(ln, 'error', this.errorLine);
    },
  }
}
</script>
