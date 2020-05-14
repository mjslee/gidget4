<template>
  <article class="media">
    <figure class="media-left">
      <b-tooltip :label="props.sprite" position="is-bottom" always>
        <div class="sprite image is-128x128">
          <img :src="spriteSrc" @click="activeTab = 0" />
        </div>
      </b-tooltip>
    </figure>

    <validation-observer
      ref="observer"
      class="media-content"
      v-slot="{ invalid, pristine }"
    >
      <b-tabs v-model="activeTab" type="is-toggle" expanded>
        <!-- Sprite Tab -->
        <b-tab-item class="media-content" label="Change Sprite" icon="image">
          <validation-provider vid="sprite" name="sprite" slim>
            <sprite-input v-model="props.sprite" :sprites="sprites" />
          </validation-provider>
        </b-tab-item>

        <!-- Options Tab -->
        <b-tab-item class="media-content" label="Object Options" icon="cog">
          <b-field grouped group-multiline>
            <!-- Type -->
            <b-field label="Type" expanded>
              <object-type-input
                :disabled="!isCreating"
                v-model="props.type"
                @change="changeType"
              />
            </b-field>

            <!-- Name -->
            <validation-provider
              rules="required|identifier"
              vid="name" name="name"
              v-slot="{ errors, valid }"
              slim
            >
              <b-field label="Name"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
                expanded
              >
                <b-input v-model="props.name" />
              </b-field>
            </validation-provider>

            <!-- Mixins -->
            <validation-provider vid="mixins" name="mixins" slim>
              <b-field label="Mixins" expanded>
                <object-mixin-input v-model="props.mixins" />
              </b-field>
            </validation-provider>
          </b-field>

          <!-- Energy -->
          <validation-provider vid="energy" name="energy" slim>
            <b-field :addons="false">
              <label class="label">Energy <small>({{ energy }}%)</small></label>
              <b-slider size="is-large" v-model="props.energy" rounded />
            </b-field>
          </validation-provider>

          <!-- Blocking -->
          <validation-provider vid="blocking" name="blocking" slim>
            <b-field>
              <b-switch v-model="props.blocking">
                <strong>Blocking</strong>
              </b-switch>
            </b-field>
          </validation-provider>
        </b-tab-item>
      </b-tabs>

      <section class="level">
        <!-- Completion -->
        <div class="level-left">
          <div class="level-item">
            <b-button
              type="is-success"
              :disabled="invalid || pristine"
              @click="complete"
            >
              {{ isCreating ? 'Create Object' : 'Apply Changes' }}
            </b-button>
          </div>
          <slot name="bottom-left"></slot>
        </div>

        <!-- Actions -->
        <div class="level-right">
          <div class="level-item">
            <switch-button class="level-item" type="is-warning" @click="reset">
              Reset
            </switch-button>
          </div>
          <slot name="bottom-right"></slot>
        </div>
      </section>
    </validation-observer>
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
    spriteSrc() {
      return ObjectSprite(this.props.sprite);
    }
  },

  data() {
    return {
      activeTab: 1
    };
  },

  methods: {
    /**
     * Update internal props to new object type.
     *
     * @param {object} obj - Base game object.
     * @return {void}
     */
    changeType(obj) {
      Object.keys(this.props).forEach((key) => {
        if (typeof obj[key] != 'undefined')
          this.props[key] = this.$clone(obj[key]);
      });
    }
  }
}
</script>
