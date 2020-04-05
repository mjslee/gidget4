<template>
  <article>
    <order-table :columns="columns" :data="goals">
      <template slot="top-right-content">
        <goal-create-button />
      </template>
      <template slot="row-details" slot-scope="props">

      </template>
    </order-table>
  </article>
</template>


<script>
import OrderTable from '../Utilities/OrderTable';
import GoalCreateButton from './GoalCreateButton';


export default {
  components: {
    OrderTable,
    GoalCreateButton
  },

  computed: {
    goals() {
      return this.$store.getters['goals/getGoals'];
    }
  },

  data() {
    return {
      columns: [
        { field: 'id', label: 'ID' },
        { field: 'assert', label: 'Assertion' },
        { field: 'args', label: 'Arguments' },
      ]
    };
  }
}
</script>
