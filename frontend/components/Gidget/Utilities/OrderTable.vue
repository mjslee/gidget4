<template>
  <article v-if="data">
    <!-- Above Table -->
    <section class="level">
      <!-- Top Left Content -->
      <div class="level-left">
        <slot name="top-left-content"></slot>
      </div>

      <!-- Top Right Content -->
      <div class="level-right">
        <div class="level-item">
          <b-button @click="closeRows" :disabled="closeDisabled">
            Condense Rows
          </b-button>
        </div>
        <div class="level-item" v-if="swapDispatch">
          <order-buttons
            :upDisabled="upDisabled"
            :downDisabled="downDisabled"
            @up="swapRow(-1)"
            @down="swapRow(1)"
          />
        </div>
        <slot name="top-right-content"></slot>
      </div>
    </section>

    <!-- Table -->
    <b-table
      ref="table"
      :columns="columns" :data="data"
      :selected.sync="internalSelected"
      :rowClass="(row) => `row-${row.id}`"
      :sticky-header="stickyHeaders"
      :default-sort="sortColumn"
      :opened-detailed="openedRows"
      :show-detail-icon="true"
      @dblclick="toggleRow"
      @details-open="openRow"
      @dragstart="dragStart"
      @drop="dragFinish"
      @dragover="dragOver"
      @dragleave="dragLeave"
      striped
      draggable
      hoverable
      detailed
      detail-key="id"
    >
      <slot slot-scope="props" v-bind="props"></slot>
      <slot slot="detail" name="detail" slot-scope="props" v-bind="props"></slot>
    </b-table>

    <!-- Below Table Below Table -->


  </article>
</template>

<style scoped>
body {
  scroll-behavior: smooth;
}
</style>

<script>
import Vue from 'vue';
import OrderButtons from './OrderButtons';


export default {
  components: {
    OrderButtons
  },

  props: {
    columns       : Array[Object],
    data          : Array[Object],
    selected      : Object,
    swapDispatch  : String,
    stickyHeaders : {
      type    : Boolean,
      default : false
    }
  },

  computed: {
    /**
     * Internal selected as to not mutate selected prop.
     */
    internalSelected: {
      get() {
        return this.selected;
      },
      set(value) {
        this.$emit('update:selected', value);
      }
    },

    /**
     * ID of the selected row. If no row is selected then -1.
     *
     * @return {number}
     */
    selectedId() {
      return this.internalSelected ? this.internalSelected.id : -1;
    },

    /**
     * Is the up button disabled?
     *
     * @return {boolean}
     */
    upDisabled() {
      return this.selectedId <= 0;
    },

    /**
     * Is the down button disabled?
     *
     * @return {boolean}
     */
    downDisabled() {
      return this.data.length && this.selectedId >= this.data.length - 1;
    },

    /**
     * Are any rows opened?
     *
     * @return {boolean}
     */
    closeDisabled() {
      return this.openedRows.length <= 0;
    }
  },

  data() {
    return {
      openedRows: [],
      draggingRow: undefined,
      sortColumn: 'id',
    };
  },

  methods: {
    /**
     * Swap row in direction.
     *
     * @param {number} direction
     *    -1 to move up.
     *     1 to move down.
     * @return {void}
     */
    swapRow(direction) {
      if (!this.internalSelected)
        return;

      const id = this.internalSelected.id;
      const fromId = id;
      const toId = id + direction;
      this.$store.dispatch(this.swapDispatch, { fromId, toId });

      this.swappedRows(fromId, toId);
    },

    /**
     * Shows swapped row notification.
     * Re-orders table by ID.
     * Closes all rows.
     *
     * @param {number} fromId
     * @param {number} toId
     * @return {void}
     */
    swappedRows(fromId, toId) {
      this.closeRows();
      this.sortColumn = 'id';
      this.$refs.table.initSort();
      this.$buefy.toast.open(
        `Swapped rows with indexes ${fromId} and ${toId}.`
      );
    },

    /**
     * Toggle row opened or closed by ID.
     *
     * @return {void}
     */
    toggleRow(row) {
      if (this.openedRows.includes(row.id))
        return this.closeRow(row);

      this.openRow(row);
    },

    /**
     * Add row ID to opened rows.
     *
     * @param {number} id
     * @return {void}
     */
    openRow(row) {
      this.internalSelected = row;
      this.openedRows.push(row.id);

      this.$nextTick(() => {
        const $el = document.querySelector(`.row-${row.id}`);
        $el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },

    /**
     * Add row ID to opened rows.
     *
     * @param {number} id
     * @return {void}
     */
    closeRow({ id }) {
      const index = this.openedRows.indexOf(id);
      if (typeof index == 'number')
        Vue.delete(this.openedRows, index);
    },

    /**
     * Close all rows with visible details.
     *
     * @return {void}
     */
    closeRows() {
      this.openedRows = [];
    },

    /**
     * Called when row dragging has begun.
     *
     * @param {object} event
     * @param {object} row
     * @return {void}
     */
    dragStart({ event, row }) {
      this.draggingRow = row;
      event.dataTransfer.effectAllowed = 'copy';
      this.closeRows();
    },

    /**
     * Called when row has been dropped.
     *
     * @param {object} event
     * @param {object} row
     * @return {void}
     */
    dragFinish({ event, row }) {
      if (!this.draggingRow || !row)
        return;

      // Re-order and re-sort
      this.$store.dispatch(this.swapDispatch, {
        fromId: this.draggingRow.id, toId: row.id
      });
      this.$refs.table.initSort();

      // Visual notification
      event.target.closest('tr').classList.remove('is-selected');
      this.swappedRows(this.draggingRow.id, row.id);
    },

    /**
     * Called when row is dragged over another row.
     *
     * @param {object} event
     * @return {void}
     */
    dragOver({ event }) {
      event.dataTransfer.dropEffect = 'copy';
      event.target.closest('tr').classList.add('is-selected');
      event.preventDefault();
    },

    /**
     * Called when row is finished dragging over another row.
     *
     * @param {object} event
     * @return {void}
     */
    dragLeave({ event }) {
      event.target.closest('tr').classList.remove('is-selected');
      event.preventDefault();
    },

  }
}
</script>
