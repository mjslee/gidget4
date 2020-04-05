<template>
  <article>
    <section class="goals" v-for="(goal, i) in goals" :key="`goal-${i}`">
      <template v-if="(goals.args)">
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
        <span v-if="goal.assert == 'equal'">
          <assert-equals v-bind="goal" />
        </span>
      </template>
    </section>

    <button @click="$emit('validate')">Validate</button>
  </article>
</template>


<style>
.goals {
  font-family: monospace;
}
</style>


<script>
import GidgetValue from '../Content/Value'
import AssertEquals from './AssertEquals';


export default {
  components: {
    GidgetValue,
    AssertEquals
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
