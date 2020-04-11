<template>
  <article class="media">
    <figure class="media-left">
      <b-tooltip :label="sprite" position="is-bottom">
        <div class="sprite image is-128x128">
          <img :src="spriteUrl" />
        </div>
      </b-tooltip>
    </figure>

    <div class="media-content">
      <b-field grouped>
        <!-- Name -->
        <b-field label="Name">
          <b-input ref="name" :value="name" @input="input"></b-input>
        </b-field>

        <!-- Mixins -->
        <b-field label="Mixins" expanded>
          <mixin-input ref="mixins" :value="mixins" @input="input" />
        </b-field>
      </b-field>

      <!-- Energy -->
      <b-field :addons="false">
        <label class="label">Energy <small>({{ energy }}%)</small></label>
        <b-slider ref="energy" size="is-large" :value="energy" @input="input" rounded />
      </b-field>

      <object-mover :object="$props" />

      <!-- Blocking -->
      <b-field>
        <b-switch ref="blocking" :value="blocking">
          <strong>Blocking</strong>
        </b-switch>
      </b-field>

      <section class="level">
        <!-- Completion -->
        <div class="level-left">
          <div class="level-item">
            <section class="buttons">
              <b-button>
                Change Sprite
              </b-button>
              <b-button type="is-success" :disabled="!canComplete" @click="complete">
                <slot name="complete-button-text">Apply Changes</slot>
              </b-button>
            </section>
          </div>
          <slot name="bottom-left"></slot>
        </div>

        <!-- Actions -->
        <div class="level-right">
          <div class="level-item">
            <switch-button type="is-warning" @click="reset">Reset</switch-button>
          </div>
          <slot name="bottom-right"></slot>
        </div>
      </section>
    </div>

  </article>
</template>

<style scoped>
.sprite {
  cursor: pointer;
}
</style>


<script>
import _            from 'lodash';
import Vue          from 'vue';
import MixinInput   from '../Inputs/MixinInput';
import FormMixin    from '../Utilities/FormMixin';
import SwitchButton from '../Utilities/SwitchButton'
import ObjectMover from './ObjectMover';

import { SpriteBaseUrl, ObjectSprites } from '@/constants/sprites';


export default {
  components: { MixinInput, SwitchButton, ObjectMover },

  mixins: [FormMixin],

  props: {
    id       : Number,
    name     : String,
    type     : String,
    energy   : Number,
    mixins   : Array[String],
    position : Object,
    sprite   : String,
    blocking : Boolean
  },


  computed: {
    /**
     * Get sprite of object with sprite path prefix.
     *
     * @return {string}
     */
    spriteUrl() {
      return SpriteBaseUrl + this.sprite + '.png';
    },
  },


  data() {
    return {
      updateKeys: ['name', 'mixins', 'energy', 'blocking']
    };
  },
}
</script>
