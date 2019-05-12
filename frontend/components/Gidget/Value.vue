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
    <GidgetValue v-for="(nestedValue, index) in value" :key="`a-${index}`" />
   &#93;
  </span>

  <span v-else-if="type === 'gameobject'" :data-type="type">
    {{ value }}a
  </span>

  <span v-else-if="type === 'object'" :data-type="type">
    {{ value }}
  </span>

  <span v-else :data-type="type">
    {{ value }} - {{ type }}
  </span>

</template>


<style>

</style>


<script>
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
