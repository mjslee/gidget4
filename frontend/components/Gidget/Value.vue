<template>
  <span :data-type="type" v-if="type === 'property'">
    <span v-for="(value, index) in internalValue" :key="index">
      <span :class="internalValue.length > 1 ? 'is-object' : 'is-variable'" v-if="index === 0">{{ value }}</span><!--
      --><span class="is-property" v-else>.{{ value }}</span>
    </span>
  </span>

  <span :data-type="type" v-else-if="type === 'variable'" class="is-variable">
    {{ internalValue }}
  </span>

  <span :data-type="type" v-else-if="type === 'number'" class="is-integer">
    {{ internalValue }}
  </span>

  <span :data-type="type" v-else-if="type === 'boolean'" class="is-boolean">
    {{ internalValue }}
  </span>

  <span :data-type="type" v-else-if="type === 'string'" class="is-string">
    '{{ internalValue }}'
  </span>

  <span :data-type="type" v-else-if="type === 'position'">
   &#91;
   <GidgetValue :value="internalValue.x" />,
   <GidgetValue :value="internalValue.y" />
   &#93;
  </span>

  <span :data-type="type" v-else-if="type === 'array'">
   &#91;
   <span v-for="(nestedValue, index) in internalValue" :key="`prop-${index}`">
     <GidgetValue :value="nestedValue" />
     <span v-if="index + 1 < internalValue.length">, </span>
   </span>
   &#93;
  </span>

  <span :data-type="type" v-else-if="type === 'gameobject'">
    <img class="image is-24x24 is-inline-block" :src="image" />
  </span>

  <span :data-type="type" v-else-if="type === 'object'">
    Object &lt;{{ Object.keys(internalValue).length }} keys&gt;
  </span>

  <span :data-type="type" v-else>
    unknown {{ type }}
  </span>
</template>


<script>
import { SPRITE_PATH } from '@/constants/paths'


export default {
  name: 'GidgetValue',

  props: {
    value: Array | Object | String | Boolean | Number,
    isCode: Boolean
  },


  data() {
    return {
      internalValue: this.value
    };
  },


  mounted() {
    // Passed in value should be considered code
    if (this.isCode && typeof this.internalValue === 'string') {
      this.internalValue = this.isString() ?
        this.internalValue.substring(1, this.internalValue.length - 1) :
        this.internalValue.split('.');
    }
  },


  watch: {
    /**
     * Update internal value when prop gets updated.
     *
     * @return {String}
     */
    value(newValue) {
      this.internalValue = newValue;
    }
  },


  computed: {
    /**
     * Type of value.
     *
     * @return {String}
     */
    type() {
      // Display as array
      if (Array.isArray(this.internalValue))
        return this.isCode ? 'property' : 'array';

      // Get type of internalValue
      const result = typeof this.internalValue;

      // Value is of primitive type
      if (result !== 'object')
        return result;

      // Is value type position?
      if (this.isPosition())
        return 'position';

      // Is value type a GameObject
      if (this.isGameObject())
        return 'gameobject';
    },


    /**
     * Get path of GameObject's sprite.
     *
     * @return string
     */
    image() {
      return SPRITE_PATH + this.internalValue.image;
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
