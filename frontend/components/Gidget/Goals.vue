<template>
  <div>
    <div class="goals" v-for="goal in gameGoals" :key="goal.id">
      <div v-if="goal.assert === 'equal'">
        <span class="keyword">assert</span>
        <span class="argument" v-html="formatArgument(goal.arguments[0])" />
        <span class="operator">===</span>
        <span class="argument" v-html="formatArgument(goal.arguments[0])" />
      </div>
    </div>
    <button @click="validateGoals">Validate</button>
  </diV>
</template>


<style>
.goals {
  font-family: monospace;
}

.keyword { color: #770088 }
.operator { color: #221199 }
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
     *
     */
    formatArgument(arg) {
      const args = arg.split('.');
      if (args.length > 1) {
        let result = `<span class="object">${args[0]}</span>.`;
        result += `<span class="prop">${args[1]}</span>`;
        return result;
      }
      else
        return `<span class="variable">${arg}</span>`;
    },

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
        this.$set(goal, 'completed', goalValidator.validate(goal));
      });
    }
  }
}
</script>
