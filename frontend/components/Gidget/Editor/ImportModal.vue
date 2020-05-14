<template>
  <b-modal :active.sync="internalValue" :width="640">
    <div class="card" v-if="internalValue">
      <header class="card-header">
        <h1 class="card-header-title">Import JSON Level Data</h1>
      </header>
      <main class="card-content">
        <div class="box">
          <codemirror
            ref="code"
            value="{}"
            :options="{ lineNumbers: true }"
          />
        </div>
      </main>
      <footer class="card-footer">
        <a class="card-footer-item" @click="importState">
          Import Data
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

  methods: {
    /**
     * Import data from editor.
     *
     * @return {void}
     */
    async importState() {
      const editor      = this.$refs.code.codemirror;
      const duration    = 3000;
      let message, type = 'is-danger';

      try {
        const data = JSON.parse(editor.getDoc().getValue('\n'));

        if (typeof data != 'object')
          message = 'Imported data is not an object!';

        if (!Array.isArray(data.tiles))       data.tiles = [];
        if (!Array.isArray(data.objects))   data.objects = [];
        if (!Array.isArray(data.dialogue)) data.dialogue = [];
        if (!Array.isArray(data.imports))   data.imports = [];
        if (!Array.isArray(data.goals))       data.goals = [];

        await this.$store.dispatch('game/loadLevel', data);
        type    = 'is-success';
        message = 'Level data imported!'
      }
      catch (e) {
        message = 'Unable to import level data!';
        console.debug(e);
      }

      this.$buefy.toast.open({ message, duration, type });
    },
  }
}
</script>
