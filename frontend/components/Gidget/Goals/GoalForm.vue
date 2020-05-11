<template>
  <validation-observer ref="observer" v-slot="{ invalid, pristine }">
    <b-field grouped>
      <validation-provider vid="assertion" name="assertion" slim>
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
      </validation-provider>

      <b-field label="Arguments">
        <goal-input :assert.sync="props.assert" :args.sync="props.args" />
      </b-field>
    </b-field>

    <section class="level">
      <!-- Completion -->
      <div class="level-left">
        <div class="level-item">
          <b-button
            type="is-success"
            @click="complete"
          >
            {{ isCreating ? 'Create Goal' : 'Apply Changes' }}
          </b-button>
        </div>
        <slot name="bottom-left"></slot>
      </div>

      <!-- Actions -->
      <div class="level-right">
        <div class="level-item">
          <switch-button class="level-item" type="is-warning" @click="reset">
            Reset
          </switch-button>
        </div>
        <slot name="bottom-right"></slot>
      </div>
    </section>
  </validation-observer>
</template>


<script>
import GoalInput from './GoalInput';
import FormMixin from '../Utilities/FormMixin';
import SwitchButton from '../Utilities/SwitchButton'
import { assertions } from '@/assets/gidget/game/gidget-assert';


export default {
  components: {
    GoalInput,
    SwitchButton
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
