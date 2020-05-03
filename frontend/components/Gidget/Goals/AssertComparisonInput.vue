<template>
  <section class="level">
    <div class="level-item">
      <span class="is-keyword">assert</span>
    </div>
    <div class="level-item">
      <b-field :label="leftLabel" :label-position="labelPosition">
        <b-input v-model="value[0]" />
      </b-field>
    </div>
    <div class="level-item">
      <span class="is-operator">{{ operator }}</span>
    </div>
    <div class="level-item">
      <b-field :label="rightLabel" :label-position="labelPosition">
        <b-input v-model="value[1]" />
      </b-field>
    </div>
  </section>
</template>


<script>
export default {
  props: {
    leftLabel: String,
    rightLabel: String,
    operator: String,
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
