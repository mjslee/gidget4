<template>
  <section class="level">
    <div class="level-item">
      <span class="is-keyword">assert</span>
    </div>
    <div class="level-item">
      <b-field label="that this" :label-position="labelPosition">
        <b-input v-model="arg0" />
      </b-field>
    </div>
    <div class="level-item">
      <span class="is-operator">==</span>
    </div>
    <div class="level-item">
      <b-field label="equals this" :label-position="labelPosition">
        <b-input v-model="arg1" />
      </b-field>
    </div>
  </section>
</template>


<script>
import TwoArgumentsMixin from '../Utilities/TwoArgumentsMixin';


export default {
  mixins: [TwoArgumentsMixin],

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
