<template>
  <order-table
    :data="objects" :selected.sync="selected"
    swapDispatch="objects/swapObjects"
  >

    <!-- Action Button -->
    <section class="level-item" slot="top-right-content">
      <!-- <dialogue-create-button /> -->
    </section>

    <!-- Column Templates -->
    <template slot-scope="props">
      <!-- ID Column -->
      <b-table-column field="id" label="#" sortable>
        {{ props.row.id }}
      </b-table-column>

      <!-- Name Column -->
      <b-table-column field="name" label="Name" sortable>
        {{ props.row.name }}
      </b-table-column>

      <!-- Mixins Column -->
      <b-table-column field="mixins" label="Mixins" sortable>
        {{ props.row.mixins }}
      </b-table-column>
    </template>

    <!-- Row Detail -->
    <section slot="detail" slot-scope="props">
      <object-form class="card-content" v-bind.sync="props.row">
        <switch-button
          slot="bottom-right"
          type="is-danger"
          @click="remove(props.row.id)"
        >
          Remove
        </switch-button>
      </object-form>
    </section>

  </order-table>
</template>



<script>
import OrderTable from '../Utilities/OrderTable';
import SwitchButton from '../Utilities/SwitchButton';
import ObjectForm from './ObjectForm';


export default {

  components: {
    OrderTable,
    SwitchButton,
    ObjectForm,
  },


  computed: {
    /**
     *
     */
    objects() {
      return this.$store.getters['objects/getObjects'];
    },
  },


  data() {
    return {
      selected: undefined
    }
  },

}
</script>
