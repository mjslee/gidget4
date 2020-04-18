<template>
  <div @click="click">
    <codemirror ref="code" v-model="code" :options="options" />
    <popover :active.sync="isPopoverActive" :element="popoverElement" />
  </div>
</template>


<style>
.CodeMirror-errorline-background {
  background: #ffe8e8 !important;
}
</style>


<script>
import _ from 'lodash';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';

import Popover from '../Content/Popover';


export default {
  components: {
    codemirror,
    Popover
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

  mounted() {
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
        extraKeys   : {
          'Ctrl-Space': 'autocomplete',
        },
        hintOptions : {
          hint           : this.getCompletions,
          completeSingle : false
        }
      },

      // Previous line numbers
      prevActiveLine : -1,
      prevErrorLine  : -1,

      // Classes for lines
      where: 'background',
      activeLineClass : 'CodeMirror-activeline-background',
      errorLineClass  : 'CodeMirror-errorline-background',

      isPopoverActive : false,
      popoverElement  : undefined,
    };
  },

  methods: {
    click(event) {
      if (!(event && event.target && event.target.className))
        return;

      switch (event.target.className) {
        case 'cm-property':
        case 'cm-variable':
          this.popoverElement  = event.target;
          this.isPopoverActive = true;
          break;

        default:
          this.popoverElement  = undefined;
          this.isPopoverActive = false;
          break;
      }
    },


    /**
     * Set class of a line by its number.
     *
     * @param {number} ln - Line number.
     * @param {number} prevLn - Previous line number.
     * @param {string} className - Name of class to add or remove.
     * @return {void}
     */
    setLineClass(ln, prevLn, className) {
      if (prevLn >= 0)
        this.editor.removeLineClass(prevLn, this.where, className);

      if (ln >= 0)
        this.editor.addLineClass(ln, this.where, className);
    },

    /**
     * Get active token and cursor from CodeMirror editor.
     *
     * @return {object[cursor,token]}
     */
    getCursor() {
      const cursor = this.editor.getCursor();
      return { cursor, activeToken: this.editor.getTokenAt(cursor) };
    },

    /**
     * Get array of game completions from game state for the CodeMirror editor.
     *
     * @return {object}
     */
    getCompletions() {
      // Get evaluated code state
      const state = this.$store.state.game.exposedData;
      if (!state)
        return;

      // Ignore tokens that are strings or comments
      const { cursor, activeToken } = this.getCursor();
      if (activeToken.type === 'string' || activeToken.type === 'comment')
        return;

      // Get all preceding tokens until reaching parent variable
      const tokens = this.getValidTokens();

      if (!tokens.length)  // Show all available objects
        return this.buildCompletions(state);

      // Get value from state.
      let value = _.get(state, tokens);

      // No value? Check for a partial prop.
      let filteredText;
      if (!value) {
        value = _.get(state, _.initial(tokens));
        filteredText = _.last(tokens);
      }

      // Build completion list from returned value of variable or property
      if (typeof value == 'object')
        return this.buildCompletions(value, filteredText);
    },

    /**
     * Build completions from an object's keys./
     *
     * @param {object} value
     * @param {string} filterText
     * @return {object}
     */
    buildCompletions(value, filterText=undefined) {
      const { cursor, activeToken: token } = this.getCursor();

      // Placement helpers. When we have a full stop it means we need to place
      // the complteion value one character to the right.
      let hasFullStop = token.string === '.' || token.string === '';
      let offset = hasFullStop ? 1 : 0;

      // Build completions array
      const completions = Object.keys(value).filter((option) => {
        // Ignore internal properties
        if (option.startsWith('get ') || option === 'isEnclosed')
          return false;

        // Partial matching
        if (filterText)
          return option.includes(filterText);

        return true;
      }).map((option) => {
        if (!isNaN(option))
          return '[' + option + ']';

        return hasFullStop ? option : '.' + option;
      });

      const line = cursor.line;
      return {
        list : completions,
        from : { line, ch: hasFullStop ? token.start + offset : token.end },
        to   : { line, ch: token.end },
      };
    },

    /**
     * Get array of tokens that are primitively valid.
     *
     * @param {function} token - (optional) CodeMirror token
     * @return {array[string]}
     */
    getValidTokens(token=undefined) {
      let { cursor, activeToken } = this.getCursor();

      if (!token)
        token = activeToken;

      const tokens = [];

      // Descend through tokens until a variable is reached
      // Up to 250 previous tokens are allowed to be processed
      for (let i = 0; i < 250; i++) {
        const str = token.string;
        const prevToken = this.editor.getTokenAt({
          line: cursor.line, ch: token.start
        });

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
          tokens.unshift(token.string);

          // We have reached the parent token: the variable
          if (token.type === 'variable')
            break;
        }

        // This is most likely to be reached when an index is specified
        else if (this.isTypeLiteral(prevToken.type))
          tokens.unshift(prevToken.string);

        // Set the current token to the previous token
        // On the next iteration we will descend further down the token chain
        token = prevToken;
      }

      return tokens;
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
