<template>
  <article class="level-item">
    <b-switch type="is-danger" v-model="canRemove"></b-switch>
    <b-button type="is-danger" @click="$emit('click')" :disabled="!canRemove">Remove</b-button>
  </article>
</template>


<script>
export default {
  data() {
    return {
      canRemove: false
    };
  }
}
</script>
