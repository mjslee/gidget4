<template>
  <b-modal :active.sync="internalValue" :width="640">
    <div class="card" v-if="internalValue">
      <header class="card-header">
        <h1 class="card-header-title">Export JSON Level Data</h1>
      </header>
      <main class="card-content">
        <div class="box">
          <codemirror
            ref="code"
            :value="exportedState"
            :options="{ readOnly: 'nocursor', lineNumbers: true }"
          />
        </div>
      </main>
      <footer class="card-footer">
        <a class="card-footer-item" @click="selectAll">
          Select All
        </a>
        <a class="card-footer-item" @click="copyToClipboard">
          Copy to Clipboard
        </a>
      </footer>
    </div>
  </b-modal>
</template>


<style scoped>
.box {
  padding: 0.25rem;
}
</style>


<script>
import { codemirror } from 'vue-codemirror';

export default {
  components: {
    codemirror
  },

  props: {
    value: Boolean
  },

  watch: {
    value(value) {
      this.updateExportedState();
    }
  },

  computed: {
    /**
     * Internal value for value prop.
     *
     * @param {boolean} value
     * @return {boolean}
     */
    internalValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },

  data() {
    return {
      exportedState: undefined
    }
  },

  mounted() {
    this.updateExportedState();
  },

  methods: {
    /**
     * Set exported state from game.
     *
     * @return {void}
     */
    updateExportedState() {
      const game = this.$store.getters['game/getGame'];
      if (game)
        this.exportedState = game.exportState();
    },

    /**
     * Select all text in CodeMirror instance.
     *
     * @return {string} Value of CodeMirror textarea
     */
    selectAll() {
      const editor = this.$refs.code.codemirror;
      if (!editor)
        return '';

      editor.execCommand('selectAll');
      return editor.getDoc().getValue("\n");
    },

    /**
     * Copy selected text to clipboard.
     *
     * @return {void}
     */
    copyToClipboard() {
      const $el = document.createElement('textarea');
      $el.value = this.selectAll();
      $el.style.position = 'absolute';
      $el.style.left = '-9999px';
      $el.setAttribute('readonly', '');

      document.body.appendChild($el);
      $el.select();
      document.execCommand('copy');
      document.body.removeChild($el);

      this.$buefy.toast.open({
        type:     'is-success',
        message:  'Copied to clipboard!',
        duration: 3000,
      });
    }
  }
}
</script>
