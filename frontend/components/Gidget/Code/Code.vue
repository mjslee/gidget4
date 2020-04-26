<template>
  <div @click="click">

    <!-- Editor -->
    <codemirror ref="code" v-model="code" :options="options" />

    <!-- Code Insight Popover -->
    <portal to="popover">
      <popover :active.sync="isPopoverActive" :element="popoverElement">
        {{ $store.getters['game/getValue'](popoverTokens) }}
      </popover>
    </portal>

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

import Popover   from '../Content/Popover';
import Highlight from '../Content/Highlight';
import Completions from './Completions';


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
     *
     */
    popoverVariable() {
      if (!this.popoverElement)
        return;

      return {
        identifier : Math.random(),
        type       : 'str',
        value      : 'val'
      };
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

      // Popovers
      popoverClasses  : ['cm-variable', 'cm-property', 'cm-keyword', 'cm-def'],
      popoverTokens   : [],
      popoverElement  : undefined,
      isPopoverActive : false,
    };
  },

  mixins: [
    Completions
  ],

  methods: {
    /*
     *
     */
    click(event) {
      // Element must exist
      if (!(event && event.target && event.target.className))
        return;

      // Unset popover
      if (!this.popoverClasses.includes(event.target.className)) {
        this.isPopoverActive = false;
        this.popoverTokens   = [];
        this.popoverElement  = undefined;
        return;
      }

      // Set popover data
      this.isPopoverActive = true;
      this.popoverTokens   = this.getValidTokens(token);
      this.popoverElement  = event.target;
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
      if (cursor.ch == 0)
        cursor.ch = 1;
      return { cursor, token: this.editor.getTokenAt(cursor) };
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
      const { cursor, token } = this.getCursor();
      if (token.type == 'string' || token.type == 'comment')
        return;

      // Get token chain behind the current cursor position
      // When no tokens, show all top-level state variables
      const tokens = this.getTokenChain(cursor.line, cursor.ch);
      if (!tokens)
        return this.buildCompletions(state, false);

      // Get value from state.
      let value = _.get(state, tokens.result.join('.'));
      let needsDot = !tokens.hasDot;

      // No value? Filter props based on current text
      let filteredText;
      if (!value) {
        // Set second to last token as value if our text doesn't end with a dot
        if (needsDot) {
          value = _.get(state, _.nth(tokens.result, -2));
          needsDot = false;
        }

        // Do not get properties for an undefined token value
        if (!value && (tokens.hasDot || tokens.result.length > 1))
          return;

        // Last token is the partial text we should filter for
        filteredText = _.last(tokens.result);
      }

      // Build completion list from returned value of variable or property
      return this.buildCompletions(value || state, needsDot, filteredText);
    },

    /**
     * Build completions from an object's keys./
     *
     * @param {object} value
     * @param {string} filterText
     * @return {object}
     */
    buildCompletions(value, prependDot=false, filterText=undefined) {
      const { cursor, token } = this.getCursor();

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

        if (prependDot)
          option = '.' + option;

        return option;
      });

      const line = cursor.line;
      return {
        list : completions,
        from : { line, ch: filterText ? token.start : token.end },
        to   : { line, ch: token.end },
      };
    },
  }
}
</script>
