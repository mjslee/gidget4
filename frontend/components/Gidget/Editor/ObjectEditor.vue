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
          <b-input ref="name" :value="name"></b-input>
        </b-field>

        <!-- Mixins -->
        <b-field label="Mixins">
          <b-taginput
            ref="mixins"
            :value="mixins"
            :data="filteredMixins"
            @typing="filterMixins"
            autocomplete
          />
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
          <b-switch type="is-danger" v-model="canRemove">
            <b-button type="is-danger" :disabled="!canRemove" @click="remove">
              Remove Object
            </b-button>
          </b-switch>
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
import Mixins from '@/assets/gidget/game/mixins';
import { SpriteBaseURL, ObjectSprites } from '@/constants/sprites';


export default {
  props: {
    id:       Number,
    name:     String,
    type:     String,
    energy:   Number,
    mixins:   Array[String],
    position: Object,
    image:    String
  },

  components: {

  },

  computed: {
    /**
     * Get sprite of object with sprite path prefix.
     */
    spriteURL() {
      return SpriteBaseURL + this.image;
    },

    /**
     * Array of available mixins.
     */
    availableMixins() {
      return Object.keys(Mixins);
    }
  },


  data() {
    return {
      canApply: false,
      canRemove: false,

      filteredMixins: [],
      updateProps: ['name', 'energy', 'mixins'],
    };
  },


  methods: {
    /**
     *
     */
    updateProp(propName) {
      const input = this.$refs[propName];
      if (!_.isEqual(input.value, input.newValue))
        this.$emit(`update:${propName}`, input.newValue);
    },

    /**
     * Apply updates
     */
    apply() {
      this.updateProps.forEach((prop) => this.updateProp(prop));
    },

    /**
     * Remove game object from world.
     */
    remove() {
      this.$store.dispatch('game/removeObject', { id: this.id });
    },

    /**
     * Set the filteredMixins with filter.
     */
    filterMixins(value) {
      this.filteredMixins = this.availableMixins.filter((mixin) => {
        return mixin.toLowerCase().indexOf(value.toLowerCase()) >= 0
      });
    },
  }
}
</script>
