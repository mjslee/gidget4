<template>
  <div>
    <div class="goals" v-for="goal in gameGoals" :key="goal.id">
      <b-icon
        icon="checkbox-blank-circle-outline"
        size="is-small"
        v-if="typeof goal.completed === 'undefined'"
      />
      <b-icon
        icon="check-circle"
        type="is-success"
        size="is-small"
        v-else-if="goal.completed"
      />
      <b-icon
        icon="close-circle"
        type="is-danger"
        size="is-small"
        v-else
      />

      <span v-if="goal.assert === 'equal'">
        <span class="keyword">assert</span>
        <GidgetValue :value="goal.arguments[0]" :longhand="true" />
        <span class="operator">===</span>
        <GidgetValue :value="goal.arguments[1]" :longhand="true" />
      </span>
    </div>
    <button @click="validateGoals">Validate</button>
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
     * Returns HTML of arguments wrapped in span elements.
     */
    formatArgument(arg) {
      const span = (c, v) => `<span class="${c}">${v}</span>`;
      const type = typeof arg;

      if (type === 'string') {
        // Is argument of form: 'Object.property'?
        if (arg.includes('.')) {
          const args = arg.split('.');
          if (args.length > 1)
            return span('object', args[0]) + '.' + span('property', args[1]);
        }

        // Argument starts with single or double quote -> string literal
        if (arg[0] === '\'' || arg[0] === '"')
          return span('string', arg);
      }

      // Argument is a number literal
      if (type === 'number')
        return span('literal', arg);

      // Any other type of argument
      return span('variable', arg);
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
