<template>
  <span>
    <a @click="isActive = !isActive">
      <highlight :value="value" />
    </a>

    <popover v-if="isActive" :active.sync="isActive" :element="$el">
      <insight :identifier="identifier" :value="evalValue || value" />
      {{ value }}: {{ evalValue }}
    </popover>
  </span>
</template>


<script>
import _ from 'lodash';
import Highlight from './Highlight';
import Popover from './Popover';
import Insight from './Insight';

export default {
  name: 'Literal',

  components: { Highlight, Popover },

  props: {
    value: Array | Object | String | Boolean | Number
  },

  computed: {
    /**
     * Determine if value is an identifier.
     *
     * @return {boolean}
     */
    identifier() {
      // Non-strings are not identifiers
      if (typeof this.value != 'string')
        return undefined;

      // Avoid false-positive identifiers
      if (
        this.value == 'true' || this.value == 'false' ||
        this.value == 'null' || this.value == 'undefined'
      )
        return undefined;

      // Test against identifier pattern
      if (/^[\w\[\]\.]+$/.test(this.value))
        return this.value;
    },

    /**
     * [TODO:description]
     *
     * @return {[TODO:type]} [TODO:description]
     */
    evalValue() {
      if (!this.identifier)
        return;

      return _.get(this.$store.state.game.evalData, this.value);
    },

    insightData() {
      return {
        identifier: this.identifier,
        value: this.evalValue || this.value
      }
    }
  },

  data() {
    return {
      isActive: false
    }
  }
}
</script>
