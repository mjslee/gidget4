<template>
  <article class="media">

    <figure class="media-left">
      <b-tooltip :label="image" position="is-bottom">
        <div class="sprite image is-128x128">
          <img :src="spriteURL" />
        </div>
      </b-tooltip>
    </figure>

    <div class="media-content">
      <section>
        <!-- Name -->
        <b-field label="Name">
          <b-input ref="name" :value="name" @input="updateName"></b-input>
        </b-field>

        <!-- Mixins -->
        <b-field label="Mixins">
          <mixin-input v-model="internalMixins" />
        </b-field>

        <!-- Energy -->
        <b-field label="Energy">
          <b-slider ref="energy" :value="energy"></b-slider>
        </b-field>

        <!-- Blocking -->
        <b-field>
          <b-switch ref="blocking" :value="blocking">
            <strong>Blocking</strong>
          </b-switch>
        </b-field>
      </section>

      <nav class="level">
        <!-- Apply -->
        <div class="level-left">
          <section class="buttons">
            <b-button>
              Change Sprite
            </b-button>
            <b-button type="is-success" :disabled="!canApply" @click="apply">
              Apply Changes
            </b-button>
          </section>
        </div>

        <!-- Remove -->
        <div class="level-right">
          <b-switch type="is-danger" v-model="canRemove"></b-switch>
          <b-button type="is-danger" :disabled="!canRemove" @click="remove">
            Remove Object
          </b-button>
        </div>
      </nav>
    </div>

  </article>
</template>

<style scoped>
.sprite {
  cursor: pointer;
}
</style>


<script>
import _ from 'lodash';
import Vue from 'vue';
import { SpriteBaseURL, ObjectSprites } from '@/constants/sprites';
import MixinInput from '../Inputs/MixinInput';


export default {
  components: {
    MixinInput
  },

  props: {
    id:       Number,
    name:     String,
    type:     String,
    energy:   Number,
    mixins:   Array[String],
    position: Object,
    image:    String,
    blocking: Boolean
  },


  computed: {
    /**
     * Internal value for mixins prop.
     *
     * @param {value}
     * @return {array[string]}
     */
    internalMixins: {
      get() {
        return this.mixins;
      },
      set(value) {
        this.updateProp('mixins', value);
      }
    },

    /**
     * Get sprite of object with sprite path prefix.
     *
     * @return {string}
     */
    spriteURL() {
      return SpriteBaseURL + this.image;
    },

    /**
     * Updates can be applied when updateProps has keys.
     *
     * @return {boolean}
     */
    canApply() {
      return !_.isEmpty(this.updateProps);
    },
  },


  data() {
    return {
      canRemove: false,

      updateProps: {},
    };
  },


  methods: {
    /**
     * Update name field.
     *
     * @param {string} value
     * @return {void}
     */
    updateProp(prop, value) {
      if (value && !_.isEqual(value, this[prop]))
        Vue.set(this.updateProps, prop, value);
      else
        Vue.delete(this.updateProps, prop);
    },

    /**
     * Update name field.
     *
     * @param {string} value
     * @return {void}
     */
    updateName(value) {
      this.updateProp('name', value);
    },

    /**
     * Apply the prop updates.
     *
     * @return {void}
     */
    apply() {
      // Emit updates for all keys in updateProps
      Object.keys(this.updateProps).forEach((key) => {
        const value = this.updateProps[key];
        if (typeof value != 'undefined')
          this.$emit(`update:${key}`, value);
      });

      // Reset updateProps
      Vue.set(this, 'updateProps', {});
    },

    /**
     * Remove game object from world.
     */
    remove() {
      this.$store.dispatch('game/removeObject', { id: this.id });
    },
  }

}
</script>
