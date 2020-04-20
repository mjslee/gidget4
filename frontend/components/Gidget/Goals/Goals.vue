<template>
  <article>
    <section class="goals" v-for="(goal, i) in goals" :key="`goal-${i}`">
      <template v-if="(goal.args)">
        <!-- Completion -->
        <b-icon
          icon="check-circle"
          type="is-success"
          size="is-small"
          v-if="goal.isComplete === true"
        />
        <b-icon
          icon="close-circle"
          type="is-danger"
          size="is-small"
          v-else-if="goal.isComplete === false"
        />
        <b-icon
          icon="checkbox-blank-circle-outline"
          size="is-small"
          v-else
        />

        <!-- Equals Assertion -->
        <span v-if="goal.assert == 'equal' || goal.assert == 'equals'">
          <assert-equals v-bind="goal" />
        </span>
      </template>
    </section>
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


  computed: {
    goals() {
      return this.$store.getters['goals/getGoals'];
    }
  },
}
</script>
