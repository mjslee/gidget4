<template>
  <div>
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
        <b-input v-model="name" :placeholder="object.type" />
      </b-field>

      <b-field label="X" label-position="on-border">
        <b-numberinput min="0" :max="maxPos" v-model="x" controls-position="compact" />
      </b-field>

      <b-field label="Y" label-position="on-border">
        <b-numberinput min="0" :max="maxPos" v-model="y" controls-position="compact" />
      </b-field>

      <b-field :label="`Energy: ${object.energy}%`">
        <b-slider v-model="object.energy" :placeholder="object.energy" />
      </b-field>

      <b-field label="Scale">
        <b-numberinput min="0.1" max="3" step="0.1" v-model="object.scale" controls-position="compact" />
      </b-field>

      <b-field label="Layer">
        <b-numberinput v-model="object.layer" controls-position="compact" />
      </b-field>

      <b-checkbox v-model="object.blocking">Blocking</b-checkbox>
    </div>
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

    /**
     * Maximum possible position for a square world.
     */
    maxPos() {
      return this.$store.getters['game/getWorldSize'] - 1;
    },

    /**
     * Get game object's name. If name is undefined, then use object's type.
     *
     * @return {string} GameObject's name or type.
     */
    name: {
      get() {
        return this.object.name.length > 0 ? this.object.name : this.object.type;
      },
      set(value) {
        this.updateObject('name', value);
      }
    },

    /**
     * Get or set game object's X position.
     */
    x: {
      get() {
        return this.object.position.x;
      },
      set(value) {
        this.updateObject('position.x', value);
      }
    },

    /**
     * Get or set game object's Y position.
     */
    y: {
      get() {
        return this.object.position.y;
      },
      set(value) {
        this.updateObject('position.y', value);
      }
    },

    /**
     * Get or set game object's energy level.
     */
    energy: {
      get() {
        return this.object.energy.y;
      },
      set(value) {
        this.updateObject('energy', value);
      }
    },

    /*
     * Get or set the scale of the game object.
     */
    scale: {
      get() {
        return this.object.scale;
      },
      set(value) {
        this.updateObject('scale', value);
      }
    },

    /*
     * Get or set the layer that the game object is on.
     */
    layer: {
      get() {
        return this.object.layer;
      },
      set(value) {
        this.updateObject('layer', value);
      }
    },

    /*
     * Get or set blocking status of the game object.
     */
    blocking: {
      get() {
        return this.object.blocking;
      },
      set(value) {
        this.updateObject('blocking', value);
      }
    },

  },

  methods: {
    /**
     * Update a property of the game object.
     *
     * @param {string} key
     * @param {any} value
     * @param {any} defaultValue
     * @return {void}
     */
    updateObject(key, value, defaultValue) {
      this.$store.commit('game/updateObject', {
        object: this.object, key, value, defaultValue
      });
    }
  }
}
</script>
