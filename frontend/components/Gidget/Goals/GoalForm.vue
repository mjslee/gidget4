<template>
  <article>
    <section>
      <b-field label="Assertion Type">
        <!-- Assertion -->
        <b-select placeholder="Select an assertion" v-model="internalAssert">
          <option
            v-for="assertion in availableAssertions"
            :value="assertion.name"
            :key="assertion.name"
          >
            {{ assertion.label }}
          </option>
        </b-select>
      </b-field>

      <assert-equals-input v-if="assert == 'equals'" />

    </section>

    <section class="level">
      <!-- Completion -->
      <div class="level-left">
        <div class="level-item">
          <b-button type="is-success" :disabled="!canComplete" @click="complete">
            <slot name="complete-button-text">Apply Changes</slot>
          </b-button>
          <slot name="bottom-left"></slot>
        </div>
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
import Vue from 'vue';
import { assertions } from '@/assets/gidget/game/gidget-goal';

import AssertEqualsInput from '../Utilities/AssertEqualsInput';


export default {
  components: {
    AssertEqualsInput
  },

  props: {
    assert: String,
    args: Array
  },

  computed: {
    internalAssert: {
      get() {
        return this.assert;
      },
      set(value) {
        this.$emit('update:assert', value);
      }
    },

    availableAssertions() {
      return assertions;
    },
  },

  data() {
    return {
      internalProps: {},

      canComplete: false,
      canReset: false,
    };
  },

  mounted() {
    // Set internal props
    for (let prop in this.$props) {
      if (typeof prop == 'undefined')
        continue;
      Vue.set(this.internalProps, prop, this.$props[prop]);
    }
  },

  methods: {
    /*
     * Complete changes to dialogue props.
     * Emits @done.
     *
     * @return {void}
     */
    complete() {
      // Emit prop updates from internal props
      for (let prop in this.internalProps)
        this.$emit(`update:${prop}`, this.internalProps[prop]);

      this.canComplete = false;
      this.$emit('done');
    },

    /*
     * Reset internalProps to values of props.
     * Emits @reset.
     *
     * @return {void}
     */
    reset() {
      for (let prop in this.internalProps)
        Vue.set(this.internalProps, prop, this.$props[prop]);

      this.$nextTick(() => {
        this.canReset = false;
        this.canComplete = false;
      });

      this.$emit('reset');
    },

  }
}
</script>
