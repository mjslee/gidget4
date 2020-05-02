<template>
  <article class="media">
    <figure class="media-left">
      <b-tooltip :label="props.sprite" position="is-bottom" always>
        <div class="sprite image is-128x128">
          <img :src="spriteUrl" @click="activeTab = 0" />
        </div>
      </b-tooltip>
    </figure>

    <div class="media-content">
      <b-tabs v-model="activeTab" type="is-toggle" expanded>
        <!-- Sprite Tab -->
        <b-tab-item label="Change Sprite" icon="image">
          <div class="media-content">
            <sprite-input v-model="props.sprite" :sprites="sprites" />
          </div>
        </b-tab-item>

        <!-- Options Tab -->
        <b-tab-item label="Object Options" icon="cog">
          <div class="media-content">
            <b-field grouped>
              <!-- Name -->
              <b-field label="Name">
                <b-input v-model="props.name" />
              </b-field>

              <!-- Mixins -->
              <b-field
                label="Mixins"
                message="There's no way of finding out what a mixin does yet!"
                expanded
              >
                <mixin-input v-model="props.mixins" />
              </b-field>
            </b-field>

            <!-- Energy -->
            <b-field :addons="false">
              <label class="label">Energy <small>({{ energy }}%)</small></label>
              <b-slider size="is-large" v-model="props.energy" rounded />
            </b-field>

            <object-mover :has-move-buttons="false" :object="$props" />

            <!-- Blocking -->
            <b-field>
              <b-switch v-model="props.blocking">
                <strong>Blocking</strong>
              </b-switch>
            </b-field>
          </div>
        </b-tab-item>
      </b-tabs>

      <section class="level">
        <!-- Completion -->
        <div class="level-left">
          <div class="level-item">
            <section class="buttons">
              <b-button type="is-success" :disabled="!canComplete" @click="complete">
                <template v-if="isCreating">Create Object</template>
                <template v-else>Apply Changes</template>
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
          <div class="level-item" v-if="!isCreating">
            <switch-button slot="bottom-right" type="is-danger" @click="remove">
              Remove
            </switch-button>
          </div>
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
import Vue          from 'vue';
import MixinInput   from '../Inputs/MixinInput';
import SpriteInput  from '../Inputs/SpriteInput';
import FormMixin    from '../Utilities/FormMixin';
import SwitchButton from '../Utilities/SwitchButton'
import ObjectMover  from './ObjectMover';

import { SpriteBaseUrl, ObjectSprites, SpriteExtension } from '@/constants/sprites';


export default {
  components: {
    MixinInput,
    SwitchButton,
    ObjectMover,
    SpriteInput
  },

  mixins: [
    FormMixin
  ],

  props: {
    isCreating: {
      type: Boolean,
      default: false
    },

    id: Number,
    name: String,
    type: String,
    energy: Number,
    mixins: Array[String],
    position: Object,
    sprite: String,
    blocking: Boolean
  },

  computed: {
    /**
     * Array of all available object sprites.
     *
     * @return {array}
     */
    sprites() {
      return ObjectSprites.map((sprite) => {
        return {
          title : sprite.title,
          src   : SpriteBaseUrl + sprite.src
        };
      });
    },

    /**
     * Get sprite of object with sprite path prefix.
     *
     * @return {string}
     */
    spriteUrl() {
      return SpriteBaseUrl + this.props.sprite + SpriteExtension;
    }
  },

  data() {
    return {
      activeTab: 0
    };
  },
}
</script>
