<template>
  <article class="level-item">
    <b-switch :type="type" v-model="canClick"></b-switch>
    <b-button :type="type" @click="$emit('click')" :disabled="!canClick">
      <slot>Remove</slot>
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
  }
}
</script>
