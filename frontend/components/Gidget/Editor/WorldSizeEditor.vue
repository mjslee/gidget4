<template>
  <section>
    <b-field grouped>
      <b-field label="Height" expanded>
        <b-slider v-model="height" v-bind="sliderAttrs" />
      </b-field>
      <b-field label="Width" expanded>
        <b-slider v-model="width" v-bind="sliderAttrs" />
      </b-field>
    </b-field>
  </section>
</template>


<script>
import Vue from 'vue';

export default {
  computed: {
    /**
     * Getter and setter for the world size.
     *
     * @param {number} height
     * @param {number} width
     * @return {object}
     */
    worldSize: {
      get() {
        return this.$store.getters['game/getWorldSize'];
      },
      set({ height, width }) {
        this.$store.commit('game/setWorldSize', { height, width });
      }
    },

    /**
     * Getter and setter for world height.
     *
     * @param {number} height
     * @return {object}
     */
    height: {
      get() {
        return this.worldSize.height;
      },
      set(height) {
        this.worldSize = { height, width: this.worldSize.width };
      }
    },

    /**
     * Getter and setter for world width.
     *
     * @param {number} width
     * @return {object}
     */
    width: {
      get() {
        return this.worldSize.width;
      },
      set(width) {
        this.worldSize = { width, height: this.worldSize.height };
      }
    }
  },

  data() {
    return {
      sliderAttrs: {
        rounded: true,
        expand: true,
        min: 3,
        max: 10,
      }
    };
  }
}
</script>
