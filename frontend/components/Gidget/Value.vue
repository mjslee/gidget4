<template>
  <v-popover class="popover" @click.native="updateValue">
    <span v-html="highlightedHtml"></span>

    <!-- Popover -->
    <Popover
      slot="popover"
      :identifier="identifier || (isIdentifier ? code : '')"
      :value="value"
      :type="type"
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
    identifier: String,
    code: Array | Object | String | Boolean | Number
  },


  components: {
    Popover
  },


  data() {
    return {
      type: 'undefined',
      value: 'undefined'
    };
  },


  mounted() {
    this.updateValue()
  },


  watch: {
    code: {
      /**
       * Update value when code is updated.
       */
      handler(newVal) {
        this.updateValue()
      },
      deep: true
    }
  },


  computed: {
    /**
     * Determine if code is an identifier.
     *
     * @return {boolean}
     */
    isIdentifier() {
      // Non-strings can never be identifiers
      if (typeof this.code !== 'string')
        return false;

      // Avoid non-identifiers
      if (this.code === 'true' || this.code === 'false' ||
          this.code === 'undefined' || this.code === 'null')
        return false;

      // Test against identifier pattern
      return /^[\w\[\]\.]+$/.test(this.code)
    },


    /**
     * Use highlight.js for syntax highlighting.
     *
     * return {string}
     */
    highlightedHtml() {
      let result
      if (typeof this.code !== 'string') {
        // Stringify non-strings
        try {
          result = JSON.stringify(this.value)
        }
        catch {  // Blocks circular JSON error
          result = '[object]'
        }
      }
      else
        result = this.code

      return hljs.highlight('javascript', result || 'undefined').value
    },
  },


  methods: {
    /**
     * Update value prop.
     *
     * Do NOT use this as a computed value. Since every time the code store is
     * updated (and we're talking about ANY value in the code store), the value
     * will be updated and a bunch of unnecessary work will be done that will
     * bog down the game fluidity.
     *
     * @return {any}
     */
    updateValue() {
      // Identifiers can have evaluated data
      if (this.isIdentifier)
        this.value = this.$store.getters['code/getValue'](this.code)

      // Non-identifiers won't have evaluated data
      else
        this.value = this.code

      // Set type of value
      this.type = typeof this.value

      // Special cases below
      if (this.type !== 'object')
        return;

      // Go through each special case
      return this.isPosition() || this.isGameObject()
    },


    /**
     * Determine if value is of the pseudo-type: Position.
     * Set type and value when true.
     *
     * this.value -> in  -> { x: 0, y: 1 }
     * this.value -> out -> [0, 1]
     *
     * @return {array}
     */
    isPosition() {
      if (typeof this.value.x === 'undefined' ||
          typeof this.value.y === 'undefined')
        return false

      this.type = 'Position'
      this.value = [this.value.x, this.value.y]
      return true
    },


    /**
     * Determine if value is of the pseudo-type: GameObject.
     * Set type and value when true.
     *
     * @return {boolean}
     */
    isGameObject() {
      if (typeof this.value.name === 'undefined')
        return false

      this.type = 'GameObject'
      this.value = ''
      return true
    },
  }
}
</script>
