<template>
  <section>
    <b-field grouped>
      <b-field label="Height" expanded>
        <b-slider v-model="worldSize.height" v-bind="sliderAttrs" />
      </b-field>
      <b-field label="Width" expanded>
        <b-slider v-model="worldSize.width" v-bind="sliderAttrs" />
      </b-field>
    </b-field>
  </section>
</template>


<script>
import Vue from 'vue';

export default {
  computed: {
    worldSize: {
      get() {
        return this.$store.getters['game/getWorldSize'];
      },
      set({ height, width }) {
        return this.$store.commit('game/setWorldSize', { height, width });
      }
    },
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
