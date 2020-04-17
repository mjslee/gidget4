<template>
  <codemirror ref="code" v-model="code" :options="options" />
</template>


<style>
.CodeMirror-errorline-background {
  background: #ffe8e8 !important;
}
</style>


<script>
import _ from 'lodash';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/lib/codemirror.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
// import 'codemirror/addon/hint/anyword-hint.js';
// import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/theme/monokai.css';


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
        extraKeys   : {'Ctrl-Space': 'autocomplete'},
        hintOptions : {hint: this.getCompletions}
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
    },

    /**
     *
     */
    getCompletions(editor, options) {
      const cursor = editor.getCursor();
      const token  = editor.getTokenAt(cursor);

      // Ignore tokens that are strings or comments
      if (/\b(?:string|comment)\b/.test(token.type))
        return;

      // Get evaluated code state
      const state = this.$store.state.game.evalData;
      if (!state)
        return;

      // Get all preceding tokens until reaching parent variable
      const tokens = this.getTokens(token, (token) =>
        editor.getTokenAt({ line: cursor.line, ch: token.start })
      );

      // Get value from state
      const value = _.get(state, tokens)
      if (!value)
        return;

      return {
        list : Object.keys(value),
        from : { line: cursor.line, ch: token.end },
      };
    },

    /**
     *
     *
     * @return {boolean}
     */
    canTokenHaveProp({ string, type }) {
      return this.isTypePropOrVar(type) || string === ']';
    },

    /**
     *
     *
     * @return {boolean}
     */
    isTypeLiteral(type) {
      return type === 'number' || type === 'string';
    },

    /**
     *
     *
     * @return {boolean}
     */
    isTypePropOrVar(type) {
      return type === 'property' || type === 'variable';
    },

    /**
     *
     */
    getTokens(token, getPrevToken) {
      const result = [];

      for (let i = 0; i < 100; i++) {
        const prevToken = getPrevToken(token);
        const str = token.string;

        // Properties can belong to variables, properties, or indicies
        if (
          ((str === '.' || str === '[') && !this.canTokenHaveProp(prevToken)) ||
          (str === ']' && !this.isTypeLiteral(prevToken.type))
        )
          return;

        else if (this.isTypePropOrVar(token.type)) {
          result.unshift(token.string);

          if (token.type === 'variable')
            break;
        }

        else if (this.isTypeLiteral(prevToken.type))
          result.unshift(prevToken.string);

        token = prevToken;
      }

      return result;
    }
  }
}
</script>
