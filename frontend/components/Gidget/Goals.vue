<template>
  <div>
    <div class="goals" v-for="goal in internalGoals" :key="goal.id">
      <b-icon
        icon="close-circle"
        type="is-danger"
        size="is-small"
        v-if="showFailures && goal.completed === false"
      />
      <b-icon
        icon="check-circle"
        type="is-success"
        size="is-small"
        v-else-if="goal.completed"
      />
      <b-icon
        icon="checkbox-blank-circle-outline"
        size="is-small"
        v-else
      />

      <span v-if="goal.assert === 'equal'">
        <span class="is-keyword">assert</span>
        <GidgetValue :value="goal.arguments[0]" :is-code="true" />
        <span class="is-operator">===</span>
        <GidgetValue :value="goal.arguments[1]" :is-code="true" />
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
      showFailures: false,
      internalGoals: this.goals,
    };
  },


  created() {
    // Assign IDs to goals
    let i = 0;
    this.internalGoals.forEach(goal => {
      this.$set(goal, 'id', i++);
    });
  },


  methods: {
    /**
     * Reset goal completed status.
     *
     * @return {void}
     */
    reset() {
      this.showFailures = false;
      this.internalGoals.forEach(goal => {
        this.$set(goal, 'completed', undefined);
      });
    },


    /**
     * Set data to use for validation.
     *
     * @param {object} data
     * @return {void}
     */
    setData(data) {
      this.data = data;
    },


    /**
     * Validate all given goals.
     *
     * @return {void}
     */
    validate() {
      const validator = Goal.create(this.world, this.data);
      this.internalGoals.forEach(goal => {
        this.$set(goal, 'completed', validator.validate(goal));
      });
    },


    /**
     * Test if all goals are completed.
     *
     * @return {boolean}
     */
    completed() {
      return this.internalGoals.every(goal => goal.completed === true );
    }
  }
}
</script>
