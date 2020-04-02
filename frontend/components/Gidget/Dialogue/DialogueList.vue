<template>
  <section>
    <!-- Meta -->
    <div class="level">
      <!-- Instructions -->
      <div class="level-left">
        Instructions: text text text
      </div>

      <!-- Buttons -->
      <div class="level-right">
        <div class="level-item">
          <order-buttons @up="swapUp" @down="swapDown" />
        </div>
        <div class="level-item">
          <dialogue-create-button />
        </div>
      </div>
    </div>

    <!-- Table -->
    <b-table
      :columns="columns"
      :data="dialogue"
      :show-detail-icon="true"
      :opened-detailed="openedRows"
      :selected.sync="selectedRow"
      hoverable
      striped
      detailed
      detail-key="id"
    >
      <template slot="detail" slot-scope="props">
        <dialogue-form class="card-content" v-bind.sync="props.row">
          <template slot="complete-button-text">
            Apply Changes
          </template>
          <template slot="bottom-right">
            <dialogue-remove-button @click="remove(props.row)" />
          </template>
        </dialogue-form>
      </template>
    </b-table>
  </section>
</template>


<script>
import Vue from 'vue';
import DialogueForm from './DialogueForm';
import DialogueCreateButton from './DialogueCreateButton';
import DialogueRemoveButton from './DialogueRemoveButton';
import OrderButtons from '@/components/Gidget/Utilities/OrderButtons';


export default {
  components: {
    OrderButtons,
    DialogueForm,
    DialogueCreateButton,
    DialogueRemoveButton
  },

  computed: {
    dialogue() {
      return this.$store.getters['dialogue/getDialogue'];
    }
  },

  data() {
    return {
      canDelete: false,

      selectedRow: undefined,
      openedRows: [],
      columns: [
        { field: 'id', label: 'ID', width: '40', numeric: true },
        { field: 'text', label: 'Text' },
      ],
    };
  },

  methods: {
    swap(direction) {
      if (!this.selectedRow)
        return;

      // in this case, ID is the index
      this.$store.dispatch('dialogue/swapDialogue', {
        from: this.selectedRow.id,
        to: this.selectedRow.id + direction
      });
    },

    swapUp() {
      
    },

    swapDown() {
      
    },

    remove(row) {
      if (row)
        this.$store.dispatch('dialogue/removeDialogue', row);
    }
  }
};
</script>
