<template>
  <div v-if="object">
    <table class="table">
      <tr v-for="prop in props" :key="prop.key">
        <th>{{ prop.name }}:</th>
        <td><Value :value="prop.value" /></td>
      </tr>
    </table>
  </div>
</template>


<script>
import Value from './Value'


export default {
  components: {
    Value
  },

  props: {
    object: Object
  },

  computed: {
    props() {
      const p = this.createProp
      return [
        p('ID', 'id'),
        p('Name', 'name'),
        p('Energy', 'energy'),
        p('Layer', 'layer'),
        p('Blocking', 'blocking'),
        p('Position', 'position'),
        p('Grabbed', 'grabbed'),
      ]
    }
  },

  methods: {
    /**
     *
     */
    createProp(name, key) {
      return { name, key, value: this.object[key] }
    },


    /**
     *
     */
    getType() {
    
    },


    /**
     *
     */
    getName(objectName, prop) {
      return this.object.name + '.' + objectName + (prop ? '.' + prop : '');
    }
  }
}
</script>
