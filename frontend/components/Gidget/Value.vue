<template>
  <v-popover>
    <!-- Property -->
    <span :data-type="type" v-if="type === 'Property'">
      <span v-for="(value, index) in internalValue" :key="index">
        <span class="is-object" v-if="index === 0">{{ value }}</span><!--
     --><span class="is-property" v-else>.{{ value }}</span>
      </span>
    </span>

    <!-- Variable -->
    <span :data-type="type" v-else-if="type === 'Variable'" class="is-variable">
      {{ internalValue }}
    </span>

    <!-- Number -->
    <span :data-type="type" v-else-if="type === 'Number'" class="is-integer">
      {{ internalValue }}
    </span>

    <!-- Boolean -->
    <span :data-type="type" v-else-if="type === 'Boolean'" class="is-boolean">
      {{ internalValue }}
    </span>

    <!-- String -->
    <span :data-type="type" v-else-if="type === 'String'" class="is-string">
      '{{ internalValue }}'
    </span>

    <!-- Position -->
    <span :data-type="type" v-else-if="type === 'Position'">
     &#91;
     <GidgetValue :value="internalValue.x" />,
     <GidgetValue :value="internalValue.y" />
     &#93;
    </span>

    <!-- Array -->
    <span :data-type="type" v-else-if="type === 'Array'">
     &#91;
     <span v-for="(nestedValue, index) in internalValue" :key="`prop-${index}`">
       <GidgetValue :value="nestedValue" />
       <span v-if="index + 1 < internalValue.length">, </span>
     </span>
     &#93;
    </span>

    <!-- GameObject -->
    <span :data-type="type" v-else-if="type === 'GameObject'">
      <img class="image is-24x24 is-inline-block" :src="image" />
    </span>

    <!-- Object -->
    <span :data-type="type" v-else-if="type === 'Object'">
      Object &lt;{{ Object.keys(internalValue).length }} keys&gt;
    </span>

    <!-- Unknown -->
    <span :data-type="type" v-else>
      unknown {{ type }}
    </span>

    <!-- Popover -->
    <Popover
      v-if="type != 'Array' && type != 'Position'"
      slot="popover"
      :identifier="internalIdentifier"
      :value="result"
      :type="type"
    />
  </v-popover>
</template>


<style scoped>
div {
  display: inline-block;
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
      internalIdentifier: undefined,
      internalType: undefined,
      internalValue: this.literal || this.value
    };
  },


  mounted() {
    // Literal not a string? Not interested
    if (typeof this.literal !== 'string')
      return;

    // Remove surrounding apostrophes of string (-> 'example' <-)
    // internalValue will still be a string but without the apostrophes
    if (this.isString()) {
      this.internalValue = this.literal.substring(1, this.literal.length - 1);
      return;
    }

    this.internalIdentifier = this.literal;

    // Split by periods for things similar to 'Object.property.property'
    // internalValue will be an array of identifiers
    if (this.literal.includes('.')) {
      this.internalType = 'Property';
      this.internalValue = this.literal.split('.');
    }

    // Literal is a string
    else {
      this.internalType = 'Variable';
      this.internalValue = this.literal;
    }
  },


  watch: {
    /**
     * Update internal value when prop gets updated.
     *
     * @return {string}
     */
    value(newValue) {
      this.internalValue = newValue;
    }
  },


  computed: {
    /**
     * Type of value.
     *
     * @return {string}
     */
    type() {
      // If we already know what the type is, use it
      if (this.internalType)
        return this.internalType;

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


    /**
     * Get result of a value or a literal.
     *
     * @return {string}
     */
    result() {
      // Not a literal? Just return the value.
      if (typeof this.value !== 'undefined')
        return this.value;

      // Get value of literal that may have been evaluated
      return this.$store.getters['code/getValue'](this.literal);
    }
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
    isString() {
      return this.internalValue[0] === '\'' &&
             this.internalValue[this.internalValue.length - 1] === '\'';
    },
  }
}
</script>
