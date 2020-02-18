<template>
  <div>
    <div>
      <button class="button is-fullwidth is-primary">New Object</button>
    </div>

    <div class="box" v-if="object">
      <div class="columns">
        <div class="column">
          <h1 class="title is-4 object-name">
            {{ name }}
          </h1>
        </div>
        <div class="column is-narrow">
          <img :src="image" :alt="object.type" class="image is-32x32" />
        </div>
      </div>

      <b-field label="Name" label-position="inside">
        <b-input v-model="object.name" :placeholder="object.type" />
      </b-field>

      <b-field label="X" label-position="on-border">
        <b-numberinput min="0" :max="maxPos" v-model="object.position.x" controls-position="compact" />
      </b-field>

      <b-field label="Y" label-position="on-border">
        <b-numberinput min="0" :max="maxPos" v-model="object.position.y" controls-position="compact" />
      </b-field>

      <b-field :label="`Energy: ${object.energy}%`">
        <b-slider v-model="object.energy" :placeholder="object.energy" />
      </b-field>

      <b-field label="Scale">
        <b-numberinput min="1" max="3" v-model="object.scale" controls-position="compact" />
      </b-field>

      <b-field label="Layer">
        <b-numberinput v-model="object.layer" controls-position="compact" />
      </b-field>

      <b-checkbox v-model="object.blocking">Blocking</b-checkbox>
    </div>

    <!-- xPosition --> 
    <!-- xBlocking --> 
    <!-- Layer --> 
    <!-- Scale --> 
  </div>
</template>


<style scoped>
.object-name {
  white-space: nowrap;
}

.label > small {
  font-weight: normal;
}
</style>


<script>
import { SPRITE_PATH } from '@/constants/paths'
import GidgetValue from '../Value'


export default {
  components: {
    GidgetValue
  },

  props: {
    object: {
      type: Object,
      default: undefined
    }
  },

  data() {
    return { };
  },

  computed: {
    /**
     * Get game object's sprite image path.
     *
     * @return {string}
     */
    image() {
      return SPRITE_PATH + this.object.image;
    },

    name() {
      return this.object.name.length > 0 ? this.object.name : this.object.type;
    },

    maxPos() {
      return this.$store.state.level.size - 1;
    }
  },

  methods: {

  }
}
</script>
