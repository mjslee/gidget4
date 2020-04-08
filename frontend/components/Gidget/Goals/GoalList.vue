<template>
  <order-table
    :data="goals" :selected.sync="selected"
    swapDispatch="goals/swapGoal"
  >

    <!-- Action Button -->
    <section class="level-item" slot="top-right-content">
      <goal-create-button />
    </section>

    <!-- Column Templates -->
    <template slot-scope="props">
      <!-- ID Column -->
      <b-table-column field="id" label="#" sortable>
        {{ props.row.id }}
      </b-table-column>

      <!-- Assertion Column -->
      <b-table-column field="assert" label="Assertion" sortable>
        {{ props.row.assert }}
      </b-table-column>

      <!-- Arguments Column -->
      <b-table-column field="args" label="Arguments" sortable>
        {{ props.row.args }}
      </b-table-column>
    </template>

    <!-- Row Detail -->
    <section slot="detail" slot-scope="props">
      <goal-form class="card-content" v-bind.sync="props.row">
        <switch-button
          slot="bottom-right"
          type="is-danger"
          @click="remove(props.row.id)"
        >
          Remove
        </switch-button>
      </goal-form>
    </section>

  </order-table>
</template>


<script>
import OrderTable from '../Utilities/OrderTable';
import SwitchButton from '../Utilities/SwitchButton';
import GoalCreateButton from './GoalCreateButton';
import GoalForm from './GoalForm';


export default {
  components: {
    OrderTable,
    SwitchButton,
    GoalCreateButton,
    GoalForm
  },

  computed: {
    goals() {
      return this.$store.getters['goals/getGoals'];
    }
  },

  data() {
    return { selected: undefined };
  },

  methods: {
    /**
     * Dispatch a goal removal by its ID.
     *
     * @param {number} id
     * @return {void}
     */
    remove(id) {
      this.$store.dispatch('goals/removeGoal', { id });
    }
  }
}
</script>
