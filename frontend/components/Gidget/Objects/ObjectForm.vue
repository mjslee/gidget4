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
        <b-tab-item class="media-content" label="Change Sprite" icon="image">
          <sprite-input v-model="props.sprite" :sprites="sprites" />
        </b-tab-item>

        <!-- Options Tab -->
        <b-tab-item class="media-content" label="Object Options" icon="cog">
          <b-field grouped group-multiline>
            <!-- Name -->
            <b-field label="Type" expanded>
              <object-type-input :disabled="!isCreating" v-model="props.type" />
            </b-field>

            <!-- Name -->
            <b-field label="Name" expanded>
              <b-input v-model="props.name" />
            </b-field>

            <!-- Mixins -->
            <b-field
              label="Mixins"
              message="There's no way of finding out what a mixin does yet!"
              expanded
            >
              <object-mixin-input v-model="props.mixins" />
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
        </b-tab-item>
      </b-tabs>

      <section class="level">
        <!-- Completion -->
        <div class="level-left">
          <div class="level-item">
            <b-button type="is-success" :disabled="!canComplete" @click="complete">
              {{ isCreating ? 'Create Object' : 'Apply Changes' }}
            </b-button>
          </div>
          <slot name="bottom-left"></slot>
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

<style scoped>
.sprite {
  cursor: pointer;
}
</style>


<script>
import SpriteInput  from '../Utilities/SpriteInput';
import FormMixin    from '../Utilities/FormMixin';
import SwitchButton from '../Utilities/SwitchButton'
import ObjectMover  from './ObjectMover';
import ObjectTypeInput  from './ObjectTypeInput';
import ObjectMixinInput from './ObjectMixinInput';

import { ObjectSprites, ObjectSprite } from '@/constants/sprites';


export default {
  components: {
    SwitchButton,
    SpriteInput,
    ObjectMover,
    ObjectTypeInput,
    ObjectMixinInput,
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
      return ObjectSprites;
    },

    /**
     * Get sprite of object with sprite path prefix.
     *
     * @return {string}
     */
    spriteUrl() {
      return ObjectSprite(this.props.sprite);
    }
  },

  data() {
    return {
      activeTab: 1
    };
  },
}
</script>
