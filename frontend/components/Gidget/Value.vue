<template>
  <span v-if="type === 'number'" :data-type="type">
    {{ value }}
  </span>

  <span v-else-if="type === 'boolean'" :data-type="type">
    {{ value }}
  </span>

  <span v-else-if="type === 'string'" :data-type="type">
    '{{ value }}'
  </span>

  <span v-else-if="type === 'position'" :data-type="type">
   &#91;
   <GidgetValue :value="value.x"/>,
   <GidgetValue :value="value.y"/>
   &#93;
  </span>

  <span v-else-if="type === 'array'" :data-type="type">
   &#91;
   <span v-for="(nestedValue, index) in value" :key="`prop-${index}`">
     <GidgetValue :value="nestedValue" />
     <span v-if="index + 1 < value.length">, </span>
   </span>
   &#93;
  </span>

  <span v-else-if="type === 'gameobject'" :data-type="type">
    <img class="image is-24x24 is-inline-block" :src="image" />
  </span>

  <span v-else-if="type === 'object'" :data-type="type">
    Object &lt;{{ Object.keys(value).length }} keys&gt;
  </span>

  <span v-else :data-type="type">
    unknown {{ type }}
  </span>
</template>


<script>
import { SPRITE_PATH } from '@/constants/paths'


export default {
  name: 'GidgetValue',

  props: {
    value: Array | Object | String | Boolean | Number,
  },


  computed: {
    /**
     * Type of value.
     *
     * @return string
     */
    type() {
      if (Array.isArray(this.value))
        return 'array';

      const result = typeof this.value
      if (result === 'object') {
        // Is object type position?
        if (this.isPosition(this.value))
          return 'position'

        // Is object type a GameObject
        if (this.isGameObject(this.value))
          return 'gameobject'
      }

      return result
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
     * Determine if value is of type 'Position'
     *
     * @param value
     * @return boolean
     */
    isPosition(value) {
      return typeof value.x !== 'undefined' && typeof value.y !== 'undefined'
    },


    /**
     * Determine if object is of type 'GameObject'
     *
     * @param value
     * @return boolean
     */
    isGameObject(value) {
      return typeof value.name !== 'undefined'
    }
  }
}
</script>
