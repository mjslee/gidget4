<template>
  <div>
    <b-table
      :columns="columns"
      :data="objects"
      :show-detail-icon="true"
      :opened-detailed="defaultOpenedDetails"
      detailed
      detail-key="id"
    >
      <template slot="detail" slot-scope="props">
        <object-editor v-bind.sync="props.row" />
      </template>
    </b-table>
  </div>
</template>


<style scoped>

</style>


<script>
import ObjectEditor from '@/components/Gidget/Editor/ObjectEditor';


export default {

  components: {
    ObjectEditor
  },


  computed: {
    /**
     *
     */
    objects() {
      return this.game.world.objects;
    },
  },


  data() {
    return {
      game: this.$store.getters['game/getGame'],

      defaultOpenedDetails: [1],
      showDetailIcon: true,

      columns: [
        {
          field: 'id',
          label: 'ID',
          width: '40',
          numeric: true
        },
        { field: 'image', label: 'Sprite' },
        { field: 'name',  label: 'Name' },
        { field: 'index', label: 'Index' },
      ]
    }
  },

}
</script>
