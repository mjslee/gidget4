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
     * Get array of game completions from game state for the CodeMirror editor.
     *
     * @param {object} editor - CodeMirror editor instance.
     * @return {object}
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
      const tokens = this.getValidTokens(token, (token) =>
        editor.getTokenAt({ line: cursor.line, ch: token.start })
      );

      // Get value from state
      const value = _.get(state, tokens)
      if (!value)
        return;

      return {
        list : Object.keys(value),
        from : { line: cursor.line, ch: token.end },
        //to : { line: cursor.line, ch: token.end },
      };
    },

    /**
     * Get array of tokens that are primitively valid.
     *
     * @param {object} token
     * @param {function} getPrevToken
     * @return {array[string]}
     */
    getValidTokens(token, getPrevToken) {
      const result = [];

      // Descend through tokens until a variable is reached
      // Up to 250 previous tokens are allowed to be processed
      for (let i = 0; i < 250; i++) {
        const str = token.string;
        const prevToken = getPrevToken(token);

        // Ensures syntax is correct...
        // Ensure that behind a '.' or '[' is a token that can have a property
        // Ensure that the token behind the index closing bracket is a literal
        if (
          ((str === '.' || str === '[') && !this.canTokenHaveProp(prevToken)) ||
          ((str === ']') && !this.isTypeLiteral(prevToken.type))
        )
          return;

        // A variable or a property should be added to result array for lookup
        else if (this.isTypePropOrVar(token.type)) {
          result.unshift(token.string);

          // We have reached the parent token: the variable
          if (token.type === 'variable')
            break;
        }

        // This is most likely to be reached when an index is specified
        else if (this.isTypeLiteral(prevToken.type))
          result.unshift(prevToken.string);

        // Set the current token to the previous token
        // On the next iteration we will descend further down the token chain
        token = prevToken;
      }

      return result;
    },

    /**
     * Is a type a literal?
     *
     * @return {boolean}
     */
    isTypeLiteral(type) {
      return type === 'number' || type === 'string';
    },

    /**
     * Is type a property or a variable?
     *
     * @param {string} type
     * @return {boolean}
     */
    isTypePropOrVar(type) {
      return type === 'property' || type === 'variable';
    },

    /**
     * Can a specified token have a property?
     *
     * @return {boolean}
     */
    canTokenHaveProp({ string, type }) {
      return this.isTypePropOrVar(type) || string === ']';
    },
  }
}
</script>
