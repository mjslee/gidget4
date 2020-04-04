<template>
  <div>
    <div class="goals" v-for="(goal, i) in goals" :key="`goal-${i}`">
      <b-icon
        icon="close-circle"
        type="is-danger"
        size="is-small"
        v-if="reveal && goal.isComplete === false"
      />
      <b-icon
        icon="check-circle"
        type="is-success"
        size="is-small"
        v-else-if="reveal && goal.isComplete"
      />
      <b-icon
        icon="checkbox-blank-circle-outline"
        size="is-small"
        v-else
      />
      <span v-if="goal.assertion === 'equal'">
        <EqualAssertion v-bind="{ args: goal.arguments }" />
      </span>
    </div>

    <button @click="$emit('validate')">Validate</button>
  </div>
</template>


<style>
.goals {
  font-family: monospace;
}
</style>


<script>
import GidgetValue from '../Content/Value'
import EqualAssertion from './EqualAssertion';


export default {
  components: {
    GidgetValue,
    EqualAssertion
  },


  data() {
    return {
      reveal: true
    };
  },


  computed: {
    goals() {
      return this.$store.getters['goals/getGoals'];
    }
  },


  methods: {
    /**
     * Reset goal completed status.
     *
     * @return {void}
     */
    reset() {
      //this.reveal = false;
    },


    /**
     * Validate all given goals.
     *
     * @return {void}
     */
    validate() {
    },
  }
}
</script>
