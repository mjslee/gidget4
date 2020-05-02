<template>
  <article class="media">
    <div class="media left image is-64x64" v-if="spriteUrl">
      <img :src="spriteUrl" />
    </div>
    <div class="media-content">
      <codemirror v-model="props.text" :options="options" @input="canComplete = true" />

      <section class="level">
        <!-- Completion -->
        <div class="level-left">
          <div class="level-item">
            <b-button type="is-success" :disabled="!canComplete" @click="complete">
              <template v-if="isCreating">Create Dialogue</template>
              <template v-else>Apply Changes</template>
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
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

import FormMixin from '../Utilities/FormMixin';
import SpriteInput from '../Inputs/SpriteInput';
import { SpriteBaseUrl, SpriteExtension } from '@/constants/paths';


export default {
  components: {
    codemirror
  },

  mixins: [
    FormMixin
  ],

  props: {
    isCreating: {
      type: Boolean,
      default: false
    },

    text: String,
    sprite: String
  },

  computed: {
    /**
     * Get url to left-side sprite if applicable.
     */
    spriteUrl() {
      if (typeof this.props.sprite == 'string')
        return SpriteBaseUrl + this.props.sprite + SpriteExtension;
    }
  },

  data() {
    return {
      options: {
        tabSize: 2,
        line: true,
        lineNumbers: true,
        lineWrapping: true
      },
    };
  },
}
</script>
