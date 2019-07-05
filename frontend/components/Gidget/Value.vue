<template>
  <v-popover class="popover" @click.native="updateValue">
    <template v-if="inTemplate && !isIdentifier">
      <span v-if="type === 'GameObject'">
        <img class="image is-24x24 is-inline-block" :src="image" />
      </span>
      <span v-else-if="type === 'Array'">
        &#91;
        <span v-for="(element, i) in value" :key="i">
          <GidgetValue :code="element" />
          <span v-if="i + 1 < value.length">, </span>
        </span>
        &#93;
      </span>
    </template>
    <span v-html="highlightedHtml" v-else></span>

    <!-- Popover -->
    <Popover
      slot="popover"
      v-if="type !== 'Array'"
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
      inTemplate: false,
      type: 'undefined',
      value: 'undefined',
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
      let result = this.isIdentifier ? this.code : this.value || this.code

      if (typeof result !== 'string') {
        // Stringify non-strings
        try {
          result = JSON.stringify(result)
        }
        catch {  // Blocks circular JSON error
          result = '[circ]'
        }
      }

      return hljs.highlight('javascript', result || 'undefined').value
    },


    /**
     * Get path of GameObject's sprite.
     *
     * @return {string}
     */
    image() {
      return SPRITE_PATH + this.value.image;
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

      // Go through each object type
      return this.isPosition() || this.isGameObject() || this.isArray()
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
      this.value = '[ ' + this.value.x + ', ' + this.value.y + ' ]'
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
      this.inTemplate = true
      return true
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
    isArray() {
      if (!Array.isArray(this.value))
        return false

      this.type = 'Array'
      this.inTemplate = true
      return true
    },
  }
}
</script>
