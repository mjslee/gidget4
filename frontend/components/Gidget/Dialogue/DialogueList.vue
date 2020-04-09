<template>
  <order-table
    :data="dialogue" :selected.sync="selected"
    swapDispatch="dialogue/swapDialogue"
  >

    <!-- Action Button -->
    <section class="level-item" slot="top-right-content">
      <dialogue-create-button />
    </section>

    <!-- Column Templates -->
    <template slot-scope="props">
      <!-- ID Column -->
      <b-table-column field="id" label="#" sortable>
        {{ props.row.id }}
      </b-table-column>

      <!-- Text Column -->
      <b-table-column field="message" label="Message" sortable>
        {{ props.row.text }}
      </b-table-column>
    </template>

    <!-- Row Detail -->
    <section slot="detail" slot-scope="props">
      <dialogue-form class="card-content" v-bind.sync="props.row">
        <switch-button
          slot="bottom-right"
          type="is-danger"
          @click="remove(props.row.id)"
        >
          Remove
        </switch-button>
      </dialogue-form>
    </section>

  </order-table>
</template>


<script>
import OrderTable from '../Utilities/OrderTable';
import SwitchButton from '../Utilities/SwitchButton';
import DialogueCreateButton from './DialogueCreateButton';
import DialogueForm from './DialogueForm';


export default {
  components: {
    OrderTable,
    SwitchButton,
    DialogueCreateButton,
    DialogueForm
  },

  computed: {
    dialogue() {
      return this.$store.getters['dialogue/getDialogue'];
    }
  },

  data() {
    return { selected: undefined };
  },

  methods: {
    /**
     * Dispatch a dialogue removal by its ID.
     *
     * @param {number} id
     * @return {void}
     */
    remove(id) {
      this.$store.dispatch('dialogue/removeDialogue', { id });
    }
  }
}
</script>
