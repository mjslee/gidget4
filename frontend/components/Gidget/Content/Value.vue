<template>
  <span>
    <!-- Literal -->
    <template v-if="typeOf == 'literal' || typeOf == 'null'">
      <a @click="isActive = !isActive">
        <highlight :value="realValue" />
      </a>
    </template>

    <!-- Identifier -->
    <template v-else-if="identifier && !displayValue">
      <a @click="isActive = !isActive">
        <highlight :value="identifier" />
      </a>
    </template>

    <!-- Position -->
    <template v-else-if="typeOf == 'position'">
      &#91; 
      <a @click="isActive = !isActive">
        <highlight :value="`${realValue.x}, ${realValue.y}`" />
      </a>
      &#93;
    </template>

    <!-- GameObject -->
    <template v-else-if="typeOf == 'gameobject'">
      <a @click="isActive = !isActive">
        <img
          class="image is-24x24"
          style="display:inline"
          :src="spriteSrc"
          v-if="spriteSrc"
        />
        <highlight :value="identifier" v-if="identifier" />
      </a>
    </template>

    <!-- Generic Object -->
    <template v-else-if="typeOf == 'object'">
      <a @click="isActive = !isActive">
        <highlight value="[Object]" />
      </a>
    </template>
    
    <!-- Array -->
    <template v-else-if="typeOf == 'array'">
      &#91;
      <template v-for="(val, i) in realValue">
        <Value :value="val" :key="i" />
        <span class="comma" v-if="i + 1 < realValue.length">, </span>
      </template>
      &#93;
    </template>

    <!-- Insight -->
    <popover v-if="isActive" :active.sync="isActive" :parent-element="$el">
      <insight
        :typeOf="typeOf"
        :identifier="identifier"
        :value="realValue"
      />
    </popover>
  </span>
</template>

<style scoped>
.comma {
  margin-left: -0.15rem;
}
</style>

<script>
import _ from 'lodash';
import Highlight from './Highlight';
import Popover from './Popover';
import Insight from './Insight';
import { ObjectSprite } from '@/constants/sprites';

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
      const value = this.identifier
        ? _.get(this.$store.state.game.evalData, this.internalValue)
        : this.internalValue;

      try {
        if (typeof value == 'string')
          return JSON.parse(value);
      } catch { }

      return value;
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
        return 'literal';

      // Null
      if (this.realValue == null)
        return 'null';

      // Array
      if (Array.isArray(this.realValue))
        return 'array';

      // Position
      if (
        typeof this.realValue.x == 'number' &&
        typeof this.realValue.y == 'number'
      )
        return 'position';

      // GameObject
      if (this.realValue.sprite)
        return 'gameobject';

      // Anything else would be an object
      return 'object';
    },

    /**
     * Sprite of game object.
     *
     * @return {string}
     */
    spriteSrc() {
      return this.typeOf == 'gameobject' && ObjectSprite(this.realValue.sprite);
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
