<template>
  <v-popover class="popover">
    <!-- Object.Property -->
    <span :data-type="valueType" v-if="literalType === 'Property'">
      <span
        v-for="(value, index) in literal.split('.')"
        :key="index"
        >
        <span class="is-object-dark" v-if="index === 0">{{ value }}</span><!--
        --><span class="is-property" v-else>.{{ value }}</span>
      </span>
    </span>

    <!-- Object -->
    <span data-type="object" v-else-if="literalType === 'Object'" class="is-object">
      {{ internalIdentifier }}
    </span>

    <!-- Variable -->
    <span data-type="variable" v-else-if="literalType === 'Variable'" class="is-variable">
      {{ internalIdentifier }}
    </span>

    <!-- Number -->
    <span :data-type="valueType" v-else-if="valueType === 'Number'" class="is-integer">
      {{ internalValue }}
    </span>

    <!-- Boolean -->
    <span :data-type="valueType" v-else-if="valueType === 'Boolean'" class="is-boolean">
      {{ internalValue }}
    </span>

    <!-- String -->
    <span :data-type="valueType" v-else-if="valueType === 'String'" class="is-string">
      '{{ internalValue }}'
    </span>

    <!-- Position -->
    <span :data-type="valueType" v-else-if="valueType === 'Position'">
     &#91;
     <GidgetValue :value="internalValue.x" />,
     <GidgetValue :value="internalValue.y" />
     &#93;
    </span>

    <!-- Array -->
    <span :data-type="valueType" v-else-if="valueType === 'Array'">
     &#91;
     <span v-for="(nestedValue, index) in internalValue" :key="`prop-${index}`">
       <GidgetValue :value="nestedValue" />
       <span v-if="index + 1 < internalValue.length">, </span>
     </span>
     &#93;
    </span>

    <!-- GameObject -->
    <span :data-type="valueType" v-else-if="valueType === 'GameObject'">
      <img class="image is-24x24 is-inline-block" :src="image" />
    </span>

    <!-- Object -->
    <span :data-type="valueType" v-else-if="valueType === 'Object'">
      Object &lt;{{ Object.keys(internalValue).length }} keys&gt;
    </span>

    <!-- Unknown -->
    <span :data-type="valueType" v-else>
      unknown {{ valueType }}
    </span>

    <!-- Popover -->
    <Popover
      slot="popover"
      :identifier="internalIdentifier"
      :value="internalValue"
      :type="valueType"
    />
  </v-popover>
</template>


<style scoped>
.popover {
  display: inline-block;
  cursor: pointer;
}
</style>


<script>
import { SPRITE_PATH } from '@/constants/paths'
import Popover from './Popover'


export default {
  name: 'GidgetValue',

  props: {
    identifier: String,
    value: Array | Object | String | Boolean | Number,
    literal: Array | Object | String | Boolean | Number
  },

  components: {
    Popover
  },


  data() {
    return {
      internalIdentifier: this.identifier,
    };
  },


  computed: {
    /**
     * Value of a literal if it exists, otherwise return literal name or value.
     *
     * @return {string}
     */
    internalValue() {
      // When this.literal is a string, it can either be a: property, variable,
      // or string; strings will be surrounded by apostrophes.
      if (typeof this.literal === 'string') {
        // Remove surrounding apostrophes from literal
        if (this.isString(this.literal)) {
          return this.literal.substring(1, this.literal.length - 1);
        }

        // Literal may have been evaluated, so try to fetch its value
        else {
          this.internalIdentifier = this.literal;
          return this.$store.getters['code/getValue'](this.literal);
        }
      }

      // Fallback
      return this.literal || this.value;
    },


    /**
     * Get type of literal.
     *
     * @return {string}
     */
    literalType() {
      // We don't care if there is no internalIdentifier
      if (typeof this.internalIdentifier !== 'string')
        return;

      if (this.internalIdentifier.includes('.'))
        return 'Property';

      var firstChar = this.internalIdentifier[0];
      return firstChar === firstChar.toUpperCase() ? 'Object' : 'Variable';
    },


    /**
     * Type of value.
     *
     * @return {string}
     */
    valueType() {
      // Display as array
      if (Array.isArray(this.internalValue))
        return 'Array';

      // Get type of internalValue
      let type = typeof this.internalValue;
      type = type.charAt(0).toUpperCase() + type.slice(1);  // Title-ize

      // Value is of primitive type
      if (type !== 'Object')
        return type;

      // Is value type position?
      if (this.isPosition())
        return 'Position';

      // Is value type a GameObject
      if (this.isGameObject())
        return 'GameObject';
    },


    /**
     * Get path of GameObject's sprite.
     *
     * @return {string}
     */
    image() {
      return SPRITE_PATH + this.internalValue.image;
    },

  },


  methods: {
    /**
     * Determine if value is of type 'position'
     *
     * @return {boolean}
     */
    isPosition() {
      return typeof this.internalValue.x !== 'undefined' &&
             typeof this.internalValue.y !== 'undefined';
    },


    /**
     * Determine if object is of type 'gameobject'
     *
     * @return {boolean}
     */
    isGameObject() {
      return typeof this.internalValue.name !== 'undefined';
    },


    /**
     * Determine if longhand value is a object/property.
     *
     * @return {boolean}
     */
    isProperty() {
      return typeof this.internalValue.property !== 'undefined';
    },


    /**
     * Determine if 'code' is a string based on its surrounding apostrophes.
     *
     * @return {boolean}
     */
    isString(value) {
      return typeof value !== 'undefined' && value[0] === '\'' && value[value.length - 1] === '\'';
    },
  }
}
</script>
