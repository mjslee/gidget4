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
     * Game store state.
     *
     * @return {object}
     */
    gameState() {
      return this.$store.state.game;
    },

    /**
     * Determine if value is an identifier.
     *
     * @return {boolean}
     */
    identifier() {
      // Non-strings are not identifiers
      if (typeof this.internalCode != 'string')
        return;

      // Avoid reserved words
      if (this.reservedWords.includes(this.internalCode))
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
        return _.get(this.gameState.docsData, this.internalCode);
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
        ? _.get(this.gameState.evalData, this.internalCode)
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
      // Keyword
      if (this.realType == 'string' && this.reservedWords.includes(this.code))
        return 'Keyword';

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
    const reservedWords = [
      'abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case',
      'catch', 'char', 'class', 'const', 'continue', 'debugger', 'default',
      'delete', 'do', 'double', 'else', 'enum', 'eval', 'export', 'extends',
      'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if',
      'implements', 'import', 'in', 'instanceof', 'int', 'interface', 'let',
      'long', 'native', 'new', 'null', 'package', 'private', 'protected',
      'public', 'return', 'short', 'static', 'super', 'switch', 'synchronized',
      'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'var',
      'void', 'volatile', 'while', 'with', 'yield'
    ];
    return { displayValue, internalCode, reservedWords };
  }
}
