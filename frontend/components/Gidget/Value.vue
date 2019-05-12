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
    object
  </span>

  <span v-else :data-type="type">
    unknown {{ type }}
  </span>

</template>


<style>

</style>


<script>
import { SPRITE_PATH } from '@/constants/paths'


export default {
  name: 'GidgetValue',

  props: {
    value: Array | Object | String | Boolean | Number,
  },


  computed: {
    type() {
      if (Array.isArray(this.value))
        return 'array';

      const result = typeof this.value
      if (result === 'object') {
        if (this.isTypePosition(this.value))
          return 'position'

        if (this.isTypeGameObject(this.value))
          return 'gameobject'
      }

      return result
    },


    image() {
      return SPRITE_PATH + this.value.image;
    }
  },


  methods: {
    /**
     *
     */
    isTypePosition(value) {
      return typeof value.x !== 'undefined' && typeof value.y !== 'undefined'
    },


    /**
     *
     */
    isTypeGameObject(value) {
      return typeof value.name !== 'undefined'
    }
  }
}
</script>
