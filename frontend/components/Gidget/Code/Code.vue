<template>
  <article v-on:keyup="keyUp">

    <!-- Editor -->
    <div @click="showPopover">
      <codemirror ref="code" v-model="code" :options="options" @input="input" />
    </div>

    <!-- Code Insight Popover -->
    <popover v-if="isActive" :active.sync="isActive" :parent-element="popoverElement">
      {{ $store.getters['game/getValue'](popoverTokens) }}
    </popover>

  </article>
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
          'Ctrl-Space': 'autocomplete'
        },
        hintOptions : {
          completeSingle: false,
          hint: this.getCompletions
        }
      },

      //
      idleTimeout : undefined,

      // Previous line numbers
      prevActiveLine : -1,
      prevErrorLine  : -1,

      // Classes for lines
      where: 'background',
      activeLineClass : 'CodeMirror-activeline-background',
      errorLineClass  : 'CodeMirror-errorline-background',

      // Popovers
      popoverClasses  : [
        'cm-variable', 'cm-property', 'cm-keyword', 'cm-def',
        'cm-number', 'cm-atom', 'cm-string'
      ],
      popoverTokens   : [],
      popoverElement  : undefined,
      isActive : false,
    };
  },

  mixins: [
    Completions
  ],

  mounted() {
    window.completionWait = 500;
  },

  methods: {
    /**
     * Called when key is released.
     *
     * @param {string} key - Value of released key.
     * @return {void}
     */
    keyUp({ key }) {
      if (key == 'Escape')
        this.hidePopover();
    },

    /*
     * Click on CodeMirror element to show code insight popover.
     *
     * @return {void}
     */
    showPopover({ target }) {
      // Element must exist
      if (!(target && target.className))
        return;

      const isCodeElement = this.popoverClasses.includes(target.className);

      // Set popover data
      if (target != this.popoverElement && isCodeElement) {
        this.popoverTokens   = this.getActiveTokens();
        this.popoverElement  = target;
        this.isActive = false;
        this.$nextTick(() => this.isActive = true);
      }

      // Unset popover
      else
        this.hidePopover();
    },

    /**
     * Hide code insight popover component.
     *
     * @return {void}
     */
    hidePopover() {
      this.isActive = false;
      this.popoverTokens   = [];
      this.popoverElement  = undefined;
    },

    /**
     * Show popup menu for completion hints.
     *
     * @return {void}
     */
    input(cmd) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = setTimeout(() => {
        this.hidePopover();
        this.editor.showHint();
      }, window.completionWait);
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
  }
}
</script>
