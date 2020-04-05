<template>
  <article>
    <div class="level">
      <div class="level-left">
        <slot name="top-left-content">
          <strong>Instructions:&nbsp;</strong> Do something.
        </slot>
      </div>

      <!-- Buttons -->
      <div class="level-right">
        <div class="level-item">
          <order-buttons @up="$emit('up')" @down="$emit('down')" />
        </div>
        <div class="level-item">
          <slot name="top-right-content">
            <!-- <dialogue-create-button /> -->
          </slot>
        </div>
      </div>
    </div>

    <b-table
      :columns="columns"
      :data="data"
      :show-detail-icon="true"
      :opened-detailed="openedRows"
      detailed
    >
      <template slot="detail" slot-scope="props">
        <slot name="row-details" v-bind:props="props">
          <!-- Details -->
        </slot>
      </template>
    </b-table>
  </article>
</template>


<script>
import OrderButtons from './OrderButtons';


export default {
  components: {
    OrderButtons
  },

  props: {
    columns: Array[Object],
    data: Array[Object]
  },

  data() {
    return {
      openedRows: []
    };
  }
}
</script>
