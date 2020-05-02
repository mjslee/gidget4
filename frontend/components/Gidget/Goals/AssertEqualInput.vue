<template>
  <section class="level">
    <div class="level-item">
      <span class="is-keyword">assert</span>
    </div>
    <div class="level-item">
      <b-field label="that this" :label-position="labelPosition">
        <b-input v-model="value[0]" />
      </b-field>
    </div>
    <div class="level-item">
      <span class="is-operator">==</span>
    </div>
    <div class="level-item">
      <b-field label="is equal to this" :label-position="labelPosition">
        <b-input v-model="value[1]" />
      </b-field>
    </div>
  </section>
</template>


<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => ['', '']
    }
  },

  data() {
    return {
      labelPosition: 'on-border',
    };
  }
}
</script>
