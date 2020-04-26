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
      :opened-detailed="openedRows"
      :show-detail-icon="true"
      :rowClass="(row) => `row-${row.id}`"
      @dblclick="toggleRow"
      @details-open="openRow"
      :sticky-header="stickyHeaders"
      :default-sort="sortColumn"
      hoverable
      striped
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
      sortColumn: 'id'
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
      this.$store.dispatch(this.swapDispatch, {
        fromId: id, toId: id + direction
      });

      this.closeRows();
      this.$refs.table.initSort();
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
    }

  }
}
</script>
