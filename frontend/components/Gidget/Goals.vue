<template>
  <div>
    <div class="goals" v-for="goal in internalGoals" :key="goal.id">
      <b-icon
        icon="close-circle"
        type="is-danger"
        size="is-small"
        v-if="showResults && goal.completed === false"
      />
      <b-icon
        icon="check-circle"
        type="is-success"
        size="is-small"
        v-else-if="showResults && goal.completed"
      />
      <b-icon
        icon="checkbox-blank-circle-outline"
        size="is-small"
        v-else
      />

      <span v-if="goal.assert === 'equal'">
        <span class="is-keyword">assert</span>
        <GidgetValue :literal="goal.arguments[0]" />
        <span class="is-operator">===</span>
        <GidgetValue :literal="goal.arguments[1]" />
      </span>
    </div>
    <button @click="validate">Validate</button>
  </div>
</template>


<style>
.goals {
  font-family: monospace;
}
</style>


<script>
import Goal from '@/assets/gidget/game/gidget-goal'
import GidgetValue from './Value'


export default {
  components: {
    GidgetValue
  },


  props: {
    goals: Array[Object],
    world: Object
  },


  data() {
    return {
      data: undefined,
      showResults: true,
      internalGoals: this.goals,
    };
  },


  created() {
    // Assign IDs to goals
    let i = 0;
    this.internalGoals.forEach(goal => {
      this.$set(goal, 'id', i++);
    });
    window.$store = this.$store;
  },


  methods: {
    /**
     * Reset goal completed status.
     *
     * @return {void}
     */
    reset() {
      //this.showResults = false;
      this.internalGoals.forEach(goal => {
        this.$set(goal, 'completed', undefined);
      });
    },


    /**
     * Validate all given goals.
     *
     * @return {void}
     */
    validate() {
      this.internalGoals.forEach(goal => {
        this.$set(goal, 'completed', this.assert(goal))
      });
    },


    /**
     * Test if all goals are completed.
     *
     * @return {boolean}
     */
    completed() {
      return this.internalGoals.every(goal => goal.completed === true);
    },


    /**
     * Get value from code store as a JSON string.
     *
     * @param {any} value
     * @return {string}
     */
    getValueJSON(value) {
      return JSON.stringify(this.$store.getters['code/getValue'](value));
    },


    /**
     * Test if all goals are completed.
     *
     * @param {object} assertion -- { assert: 'equal', arguments: [1, 1] }
     * @return {boolean}
     */
    assert(assertion) {
      switch (assertion.assert) {
        // Equality assertion
        case 'equal':
          const a = this.getValueJSON(assertion.arguments[0]);
          const b = this.getValueJSON(assertion.arguments[1]);
          return a == b;

        // Default assertion
        default:
          return false;
      }
    }
  }
}
</script>
