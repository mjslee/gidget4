<template>
  <div class="box is-paddingless" v-if="object">
    <div class="title" v-if="object.name">
      {{ object.name }}
      <img :src="image" class="image is-32x32" />
    </div>
    <table class="table is-striped is-fullwidth">
      <tbody>
        <tr>
          <th>ID</th>
          <td><GidgetValue identifier="ID" :code="object.id" /></td>
        </tr>
        <tr>
          <th>Name</th>
          <td><GidgetValue identifier="Name" :code="`'${object.name}'`" /></td>
        </tr>
        <tr>
          <th>Energy</th>
          <td><GidgetValue identifier="Energy" :code="object.energy" /></td>
        </tr>
        <tr>
          <th>Layer</th>
          <td><GidgetValue identifier="Layer" :code="object.layer" /></td>
        </tr>
        <tr>
          <th>Blocking</th>
          <td><GidgetValue identifier="Blocking" :code="object.blocking" /></td>
        </tr>
        <tr>
          <th>Position</th>
          <td><GidgetValue identifier="Position" :code="object.position" /></td>
        </tr>
        <tr>
          <th>Grabbed</th>
          <td>
            &#91;
            <span v-for="(grabbedObj, i) in grabbed" :key="grabbedObj.id">
              <GidgetValue :code="grabbedObj" />
              <span v-if="i + 1 < grabbed.length">, </span>
            </span>
            &#93;
          </td>
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
  font-weight: bold;
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
     * @return {string}
     */
    image() {
      return SPRITE_PATH + this.object.image
    },

    /**
     * Get all grabbed objects belonging to object.
     *
     * @return {string}
     */
    grabbed() {
      return this.object.world.objects.filter(obj =>
        obj.grabber === this.object.id)
    }
  },
}
</script>
