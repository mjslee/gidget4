<template>
  <v-popover class="popover" @click.native="fetchValue">
    <span v-html="highlightedHtml"></span>

    <!-- Popover -->
    <Popover
      slot="popover"
      :type="type"
      :identifier="identifier"
      :value="evalValue || internalValue"
    />
  </v-popover>
</template>


<style scoped>
.popover {
  display: inline-block;
  cursor: pointer;
}

span:hover {
  text-decoration: underline;
}
</style>


<script>
import { SPRITE_PATH } from '@/constants/paths'
import Popover from './Popover'
import hljs from 'highlight.js'


export default {
  name: 'GidgetValue',


  props: {
    //identifier: String,
    value: Array | Object | String | Boolean | Number
  },


  components: {
    Popover
  },


  data() {
    return {
      identifier: '',
      type: 'undefined',
      internalValue: 'undefined',
      evalValue: undefined
    };
  },


  mounted() {
    this.fetchValue()
  },


  watch: {
    value: {
      handler(newVal, oldVal) {
        this.fetchValue()
        console.log(newVal, oldVal)
      },
      deep: true
    }
  },


  computed: {
    /**
     * Use highlight.js for syntax highlighting.
     *
     * return {string}
     */
    highlightedHtml() {
      let result

      // Identifiers would want to be shown over the value
      if (this.identifier)
        result = this.identifier

      // Any value that is not a string we should stringify
      else if (this.type !== 'string')
        try {
          result = JSON.stringify(this.internalValue)
        }
        catch (e) {  // Block circular objects
          result = '{ ... }'
        }

      // Type is always going to be a string
      else
        result = this.internalValue

      return hljs.highlight('javascript', result || 'undefined').value
    },
  },


  methods: {
    /**
     * Use highlight.js for syntax highlighting.
     *
     * return {string}
     */
    fetchValue() {
      this.internalValue = this.resolveValue(this.value)
    },

    /**
     * Get value from a literal or from evaluated data.
     *
     * Do NOT use this as a computed value. Since every time the code store is
     * updated (and we're talking about ANY value in the code store), the value
     * will be updated and a bunch of unnecessary work will be done that will
     * bog down the game fluidity.
     *
     * @return {any}
     */
    resolveValue(value, _recursed=false) {
      const type = typeof value

      // We don't need to worry about undefined values
      if (type === 'undefined')
        return

      // An object can be normal or it can be of a special pseudo-type,
      // such as a Position or GameObject. Get the object as a special
      // object otherwise return the original value.
      if (type === 'object')
        return this.getAsSpecial(value) || value

      // Strings can be variable names or literal values. If the value is a
      // variable name then we shouuld try to get its value from the game's
      // evaluation store: code.
      if (!_recursed && type === 'string') {
        // Primitive strings will be surrounded by apostrophes, therefore
        // strings not surrounded may be a variable name.
        if (!value.startsWith('\'') || !value.endsWith('\'')) {
          this.identifier = value
          this.evalValue = this.$store.getters['code/getValue'](value)

          // No data? It's an undefined variable
          if (!this.evalValue)
            return value

          // Resolve the new value with the _recursed flag set to true so that
          // we don't try to process an evaluated string as a variable name
          return this.resolveValue(this.evalValue, true)
        }
      }

      // Any primitive type
      this.type = type
      return value
    },


    /**
     * Get object as the special type.
     *
     * @param {object} obj
     * @return {object}
     */
    getAsSpecial(obj) {
      return this.getAsPosition(obj) || this.getAsGameObject(obj)
    },


    /**
     * Get value as a position, but only if it is a position.
     *
     * Input: { x: 0, y: 1 }
     * Output: [0, 1]
     *
     * @param {object} obj
     * @return {array}
     */
    getAsPosition(obj) {
      // Positions have a 'x' and 'y' properties
      if (typeof obj.x === 'undefined' || typeof obj.y === 'undefined')
        return

      // Return as an array for those math-minded folks
      this.type = 'Position'
      return [ obj.x, obj.y ]
    },


    /**
     * Get value as a GameObject.
     *
     * @param {object} obj
     * @return {boolean}
     */
    getAsGameObject(obj) {
      if (typeof obj.name === 'undefined')
        return

      this.type = 'GameObject'
      return true
    },
  }
}
</script>
