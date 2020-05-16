<template>
  <article class="goals">
    <section class="goal" v-for="(goal, i) in goals" :key="`goal-${i}`">
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
        <goal :assert="goal.assert" :args="goal.args" />
      </template>
    </section>
  </article>
</template>


<style scoped>
.goal {
  font-size: 0.9rem;
  white-space: nowrap;
}
</style>


<script>
import Goal from './Goal';


export default {
  components: { Goal },

  computed: {
    goals() {
      return this.$store.getters['goals/getGoals'];
    }
  },
}
</script>
