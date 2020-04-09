<template>
  <article class="level-item">
    <b-switch :type="type" v-model="canClick"></b-switch>
    <b-button :type="type" @click="click" :disabled="!canClick">
      <slot></slot>
    </b-button>
  </article>
</template>


<script>
export default {
  props: {
    type: String
  },

  data() {
    return {
      canClick: false
    };
  },

  methods: {
    click() {
      this.canClick = false;
      this.$emit('click');
    }
  }
}
</script>
