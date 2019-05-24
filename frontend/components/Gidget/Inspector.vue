<template>
  <div class="box is-paddingless" v-if="object">
    <div class="title" v-if="object.name">
      {{ object.name }}
      <img :src="image" class="image is-32x32" />
    </div>
    <table class="table is-striped is-fullwidth">
      <tbody>
        <tr v-for="prop in props" :key="prop.key">
          <th>{{ prop.name }}</th>
          <td><GidgetValue :value="prop.value" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<style scoped>
.title {
  font-size: 1.75rem;
  padding: 1rem;
  margin: 0;
}

.title img {
  float: right;
}

th {
  text-align: right;
}
</style>


<script>
import { SPRITE_PATH } from '@/constants/paths'
import GidgetValue from './Value'


export default {
  components: {
    GidgetValue
  },

  props: {
    object: Object
  },

  computed: {
    /**
     * Get game object's sprite image path.
     *
     * @return string
     */
    image() {
      return SPRITE_PATH + this.object.image
    },


    /**
     * Get a list of properties belonging to the object.
     *
     * @return array[object]
     */
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
     * Create prop object with value.
     *
     * @param name
     * @param key
     * @return object
     */
    createProp(name, key) {
      return { name, key, value: this.object[key] }
    },


    /**
     * Get name of variable or property.
     *
     * @param objectName
     * @param prop
     * @return string
     */
    getName(objectName, prop) {
      return this.object.name + '.' + objectName + (prop ? '.' + prop : '');
    }
  }
}
</script>
