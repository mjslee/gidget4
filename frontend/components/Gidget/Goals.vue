<template>
  <div>
    <div v-for="goal in gameGoals" :key="goal.id">
      {{ goal }}
    </div>
    <button @click="validateGoals">Validate</button>
  </diV>
</template>


<style>

</style>


<script>
import Goal from '@/assets/gidget/game/gidget-goal'

export default {
  props: {
    goals: Array[Object],
    world: Object
  },

  data() {
    return {
      objects: undefined,
      data: undefined,
      gameGoals: this.goals,
    };
  },

  created() {
    // Assign IDs to goals
    let i = 0;
    this.gameGoals.forEach(goal => {
      this.$set(goal, 'id', i++);
    });
  },

  methods: {
    /**
     * Set data to use for validation.
     */
    setData(data) {
      this.data = data;
    },

    /**
     * Validate all given goals.
     */
    validateGoals() {
      const goalValidator = Goal.create(this.world, this.data);
      this.gameGoals.forEach(goal => {
        this.$set(goal, 'completed', goalValidator.validate(goal))
      });
    }
  }
}
</script>
