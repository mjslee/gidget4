<template>
  <span :data-type="type" v-if="type === 'property'">
    <span class="is-object">{{ value.object }}</span>.<!--
 --><span class="is-property">{{ value.property }}</span>
  </span>

  <span :data-type="type" v-else-if="type === 'variable'" class="is-variable">
    {{ value.variable }}
  </span>

  <span :data-type="type" v-else-if="type === 'number'" class="is-integer">
    {{ value }}
  </span>

  <span :data-type="type" v-else-if="type === 'boolean'" class="is-boolean">
    {{ value }}
  </span>

  <span :data-type="type" v-else-if="type === 'string'" class="is-string">
    '{{ value }}'
  </span>

  <span :data-type="type" v-else-if="type === 'position'">
   &#91;
   <GidgetValue :value="value.x" />,
   <GidgetValue :value="value.y" />
   &#93;
  </span>

  <span :data-type="type" v-else-if="type === 'array'">
   &#91;
   <span v-for="(nestedValue, index) in value" :key="`prop-${index}`">
     <GidgetValue :value="nestedValue" />
     <span v-if="index + 1 < value.length">, </span>
   </span>
   &#93;
  </span>

  <span :data-type="type" v-else-if="type === 'gameobject'">
    <img class="image is-24x24 is-inline-block" :src="image" />
  </span>

  <span :data-type="type" v-else-if="type === 'object'">
    Object &lt;{{ Object.keys(value).length }} keys&gt;
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
    longhand: Boolean
  },


  computed: {
    /**
     * Type of value.
     *
     * @return {String}
     */
    type() {
      // Longhand values can be a variable or property
      if (this.longhand) {
        if (this.isVariable(this.value))
          return 'variable';

        if (this.isProperty(this.value))
          return 'property';
      }

      // Display as array
      if (Array.isArray(this.value))
        return 'array';

      const result = typeof this.value;
      if (result === 'object') {
        // Is object a property?
        if (this.isProperty(this.value))
          return 'property';

        // Is object type position?
        if (this.isPosition(this.value))
          return 'position';

        // Is object type a GameObject
        if (this.isGameObject(this.value))
          return 'gameobject';
      }

      return result;
    },


    /**
     * Get path of GameObject's sprite.
     *
     * @return string
     */
    image() {
      return SPRITE_PATH + this.value.image;
    }
  },


  methods: {
    /**
     * Determine if value is of type 'position'
     *
     * @param {object} value
     * @return {boolean}
     */
    isPosition(value) {
      return typeof value.x !== 'undefined' && typeof value.y !== 'undefined';
    },


    /**
     * Determine if object is of type 'gameobject'
     *
     * @param {object} value
     * @return {boolean}
     */
    isGameObject(value) {
      return typeof value.name !== 'undefined';
    },


    /**
     * Determine if longhand value is a object/property.
     *
     * @param {object} value
     * @return {boolean}
     */
    isProperty(value) {
      return typeof value.property !== 'undefined';
    },


    /**
     * Determine if longhand value is a variable.
     *
     * @param {object} value
     * @return {boolean}
     */
    isVariable(value) {
      return typeof value.variable !== 'undefined';
    }
  }
}
</script>
