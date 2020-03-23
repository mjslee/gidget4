<template>
  <div class="box is-paddingless">
    <div class="title" v-if="name">
      {{ name }}
      <img :src="sprite" class="image is-32x32" />
    </div>
    <table class="table is-striped is-fullwidth">
      <tbody>
        <tr>
          <th>ID</th>
          <td><GidgetValue identifier="ID" :code="id" /></td>
        </tr>
        <tr>
          <th>Name</th>
          <td><GidgetValue identifier="Name" :code="`'${name}'`" /></td>
        </tr>
        <tr>
          <th>Energy</th>
          <td><GidgetValue identifier="Energy" :code="energy" /></td>
        </tr>
        <tr>
          <th>Layer</th>
          <td><GidgetValue identifier="Layer" :code="layer" /></td>
        </tr>
        <tr>
          <th>Blocking</th>
          <td><GidgetValue identifier="Blocking" :code="blocking" /></td>
        </tr>
        <tr>
          <th>Position</th>
          <td><GidgetValue identifier="Position" :code="position" /></td>
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
    id: Number,
    name: String,
    image: String,
    energy: Number,
    layer: Number,
    blocking: Boolean,
    position: Object
  },

  computed: {
    /**
     * Get game object's sprite image path.
     *
     * @return {string}
     */
    sprite() {
      return SPRITE_PATH + this.image
    },

    /**
     * Get all grabbed objects belonging to object.
     *
     * This should be improved eventually to cache objects and maybe a callback
     * to know exactly when to update.
     *
     * @return {string}
     */
    grabbed() {
      return this.$store.getters['game/getObjects'](
        (obj) => obj.grabber === this.id
      );
    }
  },
}
</script>
