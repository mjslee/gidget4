<template>
  <order-table
    ref="table" swapDispatch="objects/swapObjects"
    :data="objects" :selected.sync="selected"
  >

    <!-- Action Button -->
    <template slot="top-right-content">
      <div class="level-item">
        <object-create-button />
      </div>
    </template>

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
        <div class="tags" v-if="props.row.mixins">
          <span class="tag" v-for="mixin in props.row.mixins">{{ mixin }}</span>
        </div>
      </b-table-column>
    </template>

    <!-- Row Detail -->
    <section slot="detail" slot-scope="props">
      <object-form class="card-content" v-bind.sync="props.row" />
    </section>

  </order-table>
</template>



<script>
import OrderTable from '../Utilities/OrderTable';
import SwitchButton from '../Utilities/SwitchButton';
import ObjectForm from './ObjectForm';
import ObjectCreateButton from './ObjectCreateButton';


export default {

  components: {
    OrderTable,
    SwitchButton,
    ObjectForm,
    ObjectCreateButton
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

  methods: {
    /**
     * Dispatch an object removal by its ID.
     *
     * @param {number} id
     * @return {void}
     */
    remove(id) {
      this.$refs.table.toggleRow({ id });
      this.$store.dispatch('objects/removeObject', { id });
    }
  }

}
</script>
