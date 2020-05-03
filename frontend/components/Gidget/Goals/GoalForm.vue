<template>
  <article>
    <b-field grouped>
      <b-field label="Assertion">
        <!-- Assertions -->
        <b-select
          placeholder="Select an assertion"
          v-model="props.assert"
        >
          <option
            v-for="assertion in assertions"
            :value="assertion.name"
            :key="assertion.name"
          >
            {{ assertion.label }} ({{ assertion.symbol }})
          </option>
        </b-select>
      </b-field>

      <b-field label="Arguments">
        <goal-input :assert.sync="props.assert" :args.sync="props.args" />
      </b-field>
    </b-field>

    <section class="level">
      <!-- Completion -->
      <div class="level-left">
        <div class="level-item">
          <b-button type="is-success" :disabled="!canComplete" @click="complete">
            <template v-if="isCreating">Create Goal</template>
            <template v-else>Apply Changes</template>
          </b-button>
        </div>
        <slot name="bottom-left"></slot>
      </div>

      <!-- Actions -->
      <div class="level-right">
        <div class="level-item">
          <b-switch type="is-warning" v-model="canReset"></b-switch>
          <b-button type="is-warning" :disabled="!canReset" @click="reset">
            Reset
          </b-button>
        </div>
        <slot name="bottom-right"></slot>
      </div>
    </section>
  </article>
</template>


<script>
import GoalInput from './GoalInput';
import FormMixin from '../Utilities/FormMixin';
import { assertions } from '@/assets/gidget/game/gidget-assert';


export default {
  components: {
    GoalInput
  },

  mixins: [
    FormMixin
  ],

  props: {
    isCreating : {
      type    : Boolean,
      default : false
    },

    assert : String,
    args   : Array
  },

  computed: {
    /**
     * Array of all available assertion types.
     *
     * @return {string}
     */
    assertions() {
      return assertions;
    },
  },
}
</script>
