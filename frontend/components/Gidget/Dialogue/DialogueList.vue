<template>
  <order-table
    ref="table" swapDispatch="dialogue/swapDialogue"
    :data="dialogue" :selected.sync="selected"
  >

    <!-- Action Button -->
    <section class="level-item" slot="top-right-content">
      <dialogue-create-button />
    </section>

    <!-- Column Templates -->
    <template slot-scope="props">
      <!-- ID Column -->
      <b-table-column label="#" width="40" sortable>
        {{ props.row.id }}
      </b-table-column>

      <!-- Text Column -->
      <b-table-column label="Message" sortable>
        <markdown :value="props.row.text" />
      </b-table-column>
    </template>

    <!-- Row Detail -->
    <template slot="detail" slot-scope="props">
      <dialogue-form class="card-content" v-bind.sync="props.row">
        <switch-button
          slot="bottom-right"
          class="level-item"
          type="is-danger"
          @click="remove(props.row.id)"
        >
          Remove
        </switch-button>
      </dialogue-form>
    </template>

  </order-table>
</template>


<script>
import OrderTable from '../Utilities/OrderTable';
import SwitchButton from '../Utilities/SwitchButton';
import DialogueCreateButton from './DialogueCreateButton';
import DialogueForm from './DialogueForm';
import Markdown from '../Content/Markdown';


export default {
  components: {
    OrderTable,
    SwitchButton,
    DialogueCreateButton,
    DialogueForm,
    Markdown
  },

  computed: {
    dialogue() {
      return this.$store.getters['dialogue/getDialogue'];
    }
  },

  data() {
    return {
      selected: undefined
    };
  },

  methods: {
    /**
     * Dispatch a dialogue removal by its ID.
     *
     * @param {number} id
     * @return {void}
     */
    remove(id) {
      this.$refs.table.toggleRow({ id });
      this.$store.dispatch('dialogue/removeDialogue', { id });
    }
  }
}
</script>
