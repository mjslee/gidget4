<template>
  <article class="media">
    <div class="media left image is-64x64" v-if="spriteUrl">
      <img :src="spriteUrl" />
    </div>
    <validation-observer
      ref="observer"
      class="media-content"
      v-slot="{ invalid, pristine }"
    >
      <validation-provider vid="text" name="text" slim>
        <codemirror class="box" v-model="props.text" :options="options" />
      </validation-provider>

      <section class="level">
        <!-- Completion -->
        <div class="level-left">
          <div class="level-item">
            <b-button
              type="is-success"
              :disabled="invalid || pristine"
              @click="complete"
            >
              {{ isCreating ? 'Create Dialogue' : 'Apply Changes' }}
            </b-button>
          </div>
          <slot name="bottom-left"></slot>
        </div>

        <!-- Actions -->
        <div class="level-right">
          <switch-button
            class="level-item"
            type="is-warning"
            @click="reset"
          >
            Reset
          </switch-button>
          <slot name="bottom-right"></slot>
        </div>
      </section>
    </validation-observer>
  </article>
</template>


<style scoped>
.vue-codemirror {
  padding: 0.5rem !important;
}
</style>


<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/lib/codemirror.css'

import FormMixin    from '../Utilities/FormMixin';
import SwitchButton from '../Utilities/SwitchButton';
import SpriteInput  from '../Utilities/SpriteInput';
import { SpriteBaseUrl, SpriteExtension } from '@/constants/paths';


export default {
  components: {
    codemirror,
    SwitchButton
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
        mode: 'markdown',
        tabSize: 2,
        lineWrapping: true
      },
    };
  },
}
</script>
