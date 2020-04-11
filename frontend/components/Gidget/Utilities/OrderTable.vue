<template>
  <article>
    <!-- Above Table -->
    <section class="level">
      <!-- Top Left Content -->
      <div class="level-left">
        <slot name="top-left-content"></slot>
      </div>

      <!-- Top Right Content -->
      <div class="level-right">
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
      :columns="columns" :data="data"
      :selected.sync="internalSelected"
      :opened-detailed="openedRows"
      :show-detail-icon="true"
      @dblclick="toggleRow"
      hoverable striped
      detailed detail-key="id"
    >
      <slot slot-scope="props" v-bind="props"></slot>
      <slot slot="detail" name="detail" slot-scope="props" v-bind="props"></slot>
    </b-table>

    <!-- Below Table Below Table -->


  </article>
</template>


<script>
import Vue from 'vue';
import OrderButtons from './OrderButtons';


export default {
  components: {
    OrderButtons
  },

  props: {
    columns      : Array[Object],
    data         : Array[Object],
    selected     : Object,
    swapDispatch : String
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
    }
  },

  data() {
    return {
      openedRows: []
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
    },

    /**
     * Toggle row opened or closed by ID.
     *
     * @return {void}
     */
    toggleRow({ id }) {
      if (this.openedRows.includes(id))
        this.closeRow(id);
      else
        this.openRow(id);
    },

    /**
     * Add row ID to opened rows.
     *
     * @param {number} id
     * @return {void}
     */
    openRow(id) {
      this.openedRows.push(id);
    },

    /**
     * Add row ID to opened rows.
     *
     * @param {number} id
     * @return {void}
     */
    closeRow(id) {
      const index = this.openedRows.indexOf(id);
      if (typeof index == 'number')
        Vue.delete(this.openedRows, index);
    }

  }
}
</script>
