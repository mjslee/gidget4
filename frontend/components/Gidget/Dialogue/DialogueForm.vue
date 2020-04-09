<template>
  <article class="media">
    <div class="media left image is-64x64" v-if="spriteUrl">
      <img :src="spriteUrl" />
    </div>
    <div class="media-content">
      <codemirror v-model="internalProps.text" :options="options" @input="canComplete = true" />

      <section class="level">
        <!-- Completion -->
        <div class="level-left">
          <div class="level-item">
            <b-button type="is-success" :disabled="!canComplete" @click="complete">
              <slot name="complete-button-text">Apply Changes</slot>
            </b-button>
            <slot name="bottom-left"></slot>
          </div>
        </div>

        <!-- Actions -->
        <div class="level-right">
          <div class="level-item">
            <b-switch type="is-warning" v-model="canReset"></b-switch>
            <b-button type="is-warning" :disabled="!canReset" @click="reset">
              Reset
            </b-button>
          </div>
          <slot name="bottom-right"></slot>
        </div>
      </section>
    </div>
  </article>
</template>


<script>
import Vue from 'vue';
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'

import { SPRITE_PATH } from '@/constants/paths';
import SpriteSelector from '@/components/Gidget/Inputs/SpriteSelector';


export default {
  components: {
    codemirror
  },

  props: {
    text: String,
    sprite: String
  },

  computed: {
    /**
     * Get url to left-side sprite if applicable.
     */
    spriteUrl() {
      if (typeof this.internalProps.sprite == 'string')
        return SPRITE_PATH + this.internalProps.sprite + '.png';
    }
  },

  data() {
    return {
      internalProps: {},

      canComplete: false,
      canReset: false,

      // Editor
      options: {
        tabSize:     2,
        line:        true,
        lineNumbers: true,
        lineWrapping: true
      },
    };
  },

  mounted() {
    // Set internal props
    for (let prop in this.$props) {
      if (typeof prop == 'undefined')
        continue;
      Vue.set(this.internalProps, prop, this.$props[prop]);
    }
  },

  methods: {
    /*
     * Complete changes to dialogue props.
     * Emits @done.
     *
     * @return {void}
     */
    complete() {
      // Emit prop updates from internal props
      for (let prop in this.internalProps)
        this.$emit(`update:${prop}`, this.internalProps[prop]);

      this.canComplete = false;
      this.$emit('done');
    },

    /*
     * Reset internalProps to values of props.
     * Emits @reset.
     *
     * @return {void}
     */
    reset() {
      for (let prop in this.internalProps)
        Vue.set(this.internalProps, prop, this.$props[prop]);

      this.$nextTick(() => {
        this.canReset = false;
        this.canComplete = false;
      });

      this.$emit('reset');
    },

  }
}
</script>
