<template>
  <div class="box is-paddingless">
    <div class="title" v-if="name">
      {{ name }}
      <img :src="spriteUrl" class="image is-32x32" />
    </div>
    <table class="table is-striped is-fullwidth">
      <tbody>
        <tr>
          <th>ID</th>
          <td><Value :value="id" /></td>
        </tr>
        <tr>
          <th>Name</th>
          <td><Value :value="`'${name}'`" /></td>
        </tr>
        <tr>
          <th>Energy</th>
          <td><Value :value="energy" /></td>
        </tr>
        <tr>
          <th>Layer</th>
          <td><Value :value="layer" /></td>
        </tr>
        <tr>
          <th>Blocking</th>
          <td><Value :value="blocking" /></td>
        </tr>
        <tr>
          <th>Position</th>
          <td><Value :value="position" /></td>
        </tr>
        <tr>
          <th>Grabbed</th>
          <td>
            <Value :value="grabbed" />
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
import Value from '../Content/Value'


export default {
  components: {
    Value
  },

  props: {
    id       : Number,
    name     : String,
    sprite   : String,
    energy   : Number,
    layer    : Number,
    blocking : Boolean,
    position : Object
  },


  computed: {
    /**
     * Get game object's sprite image path.
     *
     * @return {string}
     */
    spriteUrl() {
      return SPRITE_PATH + this.sprite + '.png';
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
      return this.$store.getters['objects/getObjects'].filter(
        (obj) => obj.grabber === this.id
      );
    }
  }
}
</script>
