<template>
  <article>
    <b-field grouped>
      <b-field label="Assertion Type">
        <!-- Assertions -->
        <b-select placeholder="Select an assertion" v-model="internalAssert">
          <option
            v-for="assertion in availableAssertions"
            :value="assertion.name"
            :key="assertion.name"
          >
            {{ assertion.label }} ({{ assertion.symbol }})
          </option>
        </b-select>
      </b-field>

      <b-field label="Arguments">
        <goal-input v-bind:assert="internalAssert" v-bind:args="internalArgs" />
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
import _ from 'lodash';
import Vue from 'vue';
import { assertions } from '@/assets/gidget/game/gidget-assert';
import GoalInput from '../Inputs/GoalInput';


export default {
  components: {
    GoalInput
  },

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
     * Internal counterpart to args prop.
     *
     * @param {Array[String]} value
     * @return {Array[String]}
     */
    internalArgs: {
      get() {
        return this.internalArgsValue;
      },
      set(value) {
        this.internalArgsValue = value;
        this.canComplete       = true;
      }
    },

    /**
     * Internal counterpart to assert prop.
     *
     * @param {String} value
     * @return {String}
     */
    internalAssert: {
      get() {
        return this.internalAssertValue;
      },
      set(value) {
        this.internalAssertValue = value;
        this.canComplete         = true;
      }
    },

    /**
     * Array of all available assertion types.
     *
     * @return {string}
     */
    availableAssertions() {
      return assertions;
    },
  },

  data() {
    return {
      internalAssertValue: _.clone(this.$props.assert),
      internalArgsValue:   _.clone(this.$props.args),

      canComplete: false,
      canReset:    false,
    };
  },

  methods: {
    /**
     * Complete changes to dialogue props.
     * Emits @done.
     *
     * @return {void}
     */
    complete() {
      this.$emit('update:assert', this.internalAssert);
      this.$emit('update:args',   this.internalArgs);

      this.canComplete = false;
      this.$emit('done');
    },

    /**
     * Reset internalProps to values of props.
     * Emits @reset.
     *
     * @return {void}
     */
    reset() {
      this.internalAssert = _.clone(this.$props.assert);
      this.internalArgs   = _.clone(this.$props.args);

      this.$nextTick(() => {
        this.canReset = false;
        this.canComplete = false;
      });

      this.$emit('reset');
    },

  }
}
</script>
