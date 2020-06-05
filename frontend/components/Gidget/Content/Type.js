import _ from 'lodash';


export default {
  props: {
    code: Array | Object | String | Boolean | Number
  },

  watch: {
    code(value) {
      this.internalCode = value;
    }
  },

  computed: {
    /**
     * Determine if value is an identifier.
     *
     * @return {boolean}
     */
    identifier() {
      // Non-strings are not identifiers
      if (typeof this.internalCode != 'string')
        return;

      // Avoid false-positive identifiers
      if (
        this.internalCode == 'true' || this.internalCode == 'false' ||
        this.internalCode == 'null' || this.internalCode == 'undefined'
      )
        return;

      // Test against identifier pattern
      if (/^[\w\[\]\.]+$/.test(this.internalCode))
        return this.internalCode;
    },

    /**
     * Tokens of an identifier.
     *
     * @return {array|undefined}
     */
    tokens() {
      if (this.identifier)
        return _.toPath(this.identifier)
    },

    /**
     * Get documentation of identifier.
     *
     * @return {any}
     */
    documentation() {
      if (this.identifier)
        return _.get(this.$store.state.game.docsData, this.internalCode);
    },

    /**
     * Get value of identifier or literal.
     * For identifiers: return value of identifier within state.
     * For literals: return literal.
     *
     * @return {any}
     */
    value() {
      const value = this.identifier
        ? _.get(this.$store.state.game.evalData, this.internalCode)
        : this.internalCode;

      try {
        if (typeof value == 'string')
          return JSON.parse(value);
      } catch { }

      return value;
    },

    /**
     * Real type of value.
     *
     * @return {string}
     */
    realType() {
      return typeof this.value;
    },

    /**
     * Get type of value.
     *
     * @return {string}
     */
    type() {
      // Literal
      if (this.realType != 'object')
        return _.capitalize(this.realType);

      // Null
      if (this.value == null)
        return 'Null';

      // Array
      if (Array.isArray(this.value))
        return 'Array';

      // Position
      if (typeof this.value.x == 'number' && typeof this.value.y == 'number')
        return 'Position';

      // GameObject
      if (this.value.sprite)
        return 'GameObject';

      // Anything else would be an object
      return 'Object';
    },
  },

  data() {
    const displayValue = typeof this.code == 'string' && this.code[0] == '!';
    const internalCode = displayValue ? this.code.slice(1) : this.code;
    return { displayValue, internalCode };
  }
}
