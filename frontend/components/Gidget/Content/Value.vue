<template>
  <span>
    <a @click="isActive = !isActive">
      <highlight :value="identifier && !displayValue ? identifier : realValue" />
    </a>

    <popover v-if="isActive" :active.sync="isActive" :parent-element="$el">
      <insight
        :typeOf="typeOf"
        :identifier="identifier"
        :value="realValue"
      />
    </popover>
  </span>
</template>


<script>
import _ from 'lodash';
import Highlight from './Highlight';
import Popover from './Popover';
import Insight from './Insight';

export default {
  name: 'Value',

  components: { Highlight, Popover, Insight },

  props: {
    value: Array | Object | String | Boolean | Number
  },

  computed: {
    /**
     * Internal modifications of value prop.
     *
     * When a string is prepended with an exclamation point (!), displayValue
     * will be * flipped to true and the value will be shown rather than the
     * identifier.
     *
     * @return {any}
     */
    internalValue() {
      this.displayValue = typeof this.value == 'string' && this.value[0] == '!';
      return this.displayValue ? this.value.slice(1) : this.value;
    },
    
    /**
     * Determine if value is an identifier.
     *
     * @return {boolean}
     */
    identifier() {
      // Non-strings are not identifiers
      if (typeof this.internalValue != 'string')
        return undefined;

      // Avoid false-positive identifiers
      if (
        this.internalValue == 'true' || this.internalValue == 'false' ||
        this.internalValue == 'null' || this.internalValue == 'undefined'
      )
        return undefined;

      // Test against identifier pattern
      if (/^[\w\[\]\.]+$/.test(this.internalValue))
        return this.internalValue;
    },

    /**
     * Get value of identifier or literal.
     * For identifiers: return value of identifier within state.
     * For literals: return literal.
     *
     * @return {any}
     */
    realValue() {
      return this.identifier
        ? _.get(this.$store.state.game.evalData, this.internalValue)
        : this.internalValue;
    },

    /**
     * Get type of value.
     *
     * @return {string}
     */
    typeOf() {
      const typeOf = typeof this.realValue;

      // Literal
      if (typeOf != 'object')
        return typeOf;

      // Array
      if (Array.isArray(this.realValue))
        return 'array';

      // Null
      if (this.realValue == null)
        return 'null';

      // Position
      if (
        typeof this.realValue.x == 'number' &&
        typeof this.realValue.y == 'number'
      )
        return 'position';

      // GameObject
      if (this.realValue.gameObject)
        return 'gameobject';

      // Anything else would be an object
      return 'object';
    }
  },

  data() {
    return {
      isActive:     false,
      displayValue: false
    }
  }
}
</script>
