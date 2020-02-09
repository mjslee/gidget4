<template>
  <div>
    <div class="goals" v-for="goal in goals" :key="goal.id">
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
        <GidgetValue :code="goal.arguments[0]" />
        <span class="is-operator">===</span>
        <GidgetValue :code="goal.arguments[1]" />
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
import GidgetValue from './Value'


export default {
  components: {
    GidgetValue
  },


  props: {
    initialGoals: Array[Object],
    world: Object
  },


  data() {
    return {
      showResults: true,
      goals:       [],
    };
  },


  created() {
    // Assign IDs to goals
    let i = 0;
    this.goals.forEach((goal) => {
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

      if (typeof this.goals == 'undefined') {
        console.debug('goals are undefined.');
        return;
      }

      this.goals.forEach((goal) => {
        this.$set(goal, 'completed', undefined);
      });
    },


    /**
     * Validate all given goals.
     *
     * @return {void}
     */
    validate() {
      this.goals.forEach(goal => {
        this.$set(goal, 'completed', this.assert(goal))
      });
    },


    /**
     * Test if all goals are completed.
     *
     * @return {boolean}
     */
    completed() {
      return this.goals.every(goal => goal.completed === true);
    },


    /**
     * Get value from code store as a JSON string.
     *
     * @param {any} value
     * @return {string}
     */
    getValueJSON(value) {
      return JSON.stringify(
        this.$store.getters['evaldata/getValue'](value) || value
      );
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
