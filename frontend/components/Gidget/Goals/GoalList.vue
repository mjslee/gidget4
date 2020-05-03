<template>
  <order-table
    ref="table" swapDispatch="goals/swapGoal"
    :data="goals" :selected.sync="selected"
  >

    <!-- Action Button -->
    <section class="level-item" slot="top-right-content">
      <goal-create-button />
    </section>

    <!-- Column Templates -->
    <template slot-scope="props">
      <!-- ID Column -->
      <b-table-column label="#" width="40" sortable>
        {{ props.row.id }}
      </b-table-column>

      <!-- Arguments Column -->
      <b-table-column label="Goal" sortable>
        <goal :assert="props.row.assert" :args="props.row.args" />
      </b-table-column>
    </template>

    <!-- Row Detail -->
    <template slot="detail" slot-scope="props">
      <goal-form
        :assert.sync="props.row.assert"
        :args.sync="props.row.args"
      >
        <switch-button
          slot="bottom-right"
          class="level-item"
          type="is-danger"
          @click="remove(props.row.id)"
        >
          Remove
        </switch-button>
      </goal-form>
    </template>

  </order-table>
</template>

<style>
.detail-container .level:last-child {
  padding: 0;
}
</style>


<script>
import OrderTable from '../Utilities/OrderTable';
import SwitchButton from '../Utilities/SwitchButton';
import GoalCreateButton from './GoalCreateButton';
import GoalForm from './GoalForm';
import Goal from './Goal';


export default {
  components: {
    OrderTable,
    SwitchButton,
    Goal,
    GoalForm,
    GoalCreateButton
  },

  computed: {
    goals() {
      return this.$store.getters['goals/getGoals'];
    }
  },

  data() {
    return {
      selected: undefined
    };
  },

  methods: {
    /**
     * Dispatch a goal removal by its ID.
     *
     * @param {number} id
     * @return {void}
     */
    remove(id) {
      this.$refs.table.toggleRow({ id });
      this.$store.dispatch('goals/removeGoal', { id });
    }
  }
}
</script>
