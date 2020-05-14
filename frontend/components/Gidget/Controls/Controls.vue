<template>
  <article>

    <b-slider
      class="slider"
      size="is-large"
      v-model="activeStep"
      :min="0"
      :max="stepCount"
      bigger-slider-focus
      rounded
    >
      <template v-if="stepCount > 0">
        <template v-for="step in stepCount + 1">
          <b-slider-tick :value="step - 1" :key="step">{{ step - 1 }}</b-slider-tick>
        </template>
      </template>
    </b-slider>

    <section class="buttons has-addons">
      <!-- Prev Step -->
      <b-button
        icon-left="chevron-left"
        :disabled="!hasPrev"
        @click="activeStep -= 1"
      />

      <!-- Next Step -->
      <b-button
        icon-left="chevron-right"
        :disabled="!hasNext"
        @click="activeStep += 1"
      />

      <!-- Run -->
      <b-button
        icon-left="play"
        class="is-success"
        @click="$emit('run')"
        v-if="activeStep == 0"
      >
        Run
      </b-button>

      <!-- Stop -->
      <b-button
        icon-left="stop"
        class="is-danger"
        @click="$emit('stop')"
        v-else-if="!isComplete"
      >
        Stop
      </b-button>

      <!-- Reset -->
      <b-button
        icon-left="restart"
        class="is-warning"
        @click="$emit('reset')"
        v-else
      >
        Reset
      </b-button>
    </section>
  </article>
</template>


<style scoped>
.slider {
  margin-top: 0;
  margin-bottom: 0.75rem;
}

/deep/ .b-slider .b-slider-tick-label {
  padding-top: 0.5rem;
}
</style>


<script>
export default {

  computed: {
    /**
     * Is there a previous step?
     *
     * @return {boolean}
     */
    hasPrev() {
      return this.activeStep > 0;
    },


    /**
     * Is there a next step?
     *
     * @return {boolean}
     */
    hasNext() {
      return this.stepCount == 0 || this.activeStep < this.stepCount;
    },


    /**
     * Can the player reset the game?
     *
     * @return {boolean}
     */
    isComplete() {
      return this.activeStep >= this.stepCount;
    },

    /**
     * Amount of steps.
     *
     * @return {number}
     */
    stepCount() {
      return this.$store.state.game.stepCount;
    },

    /**
     * Index of active step.
     *
     * @return {number}
     */
    activeStep: {
      get() {
        return this.$store.state.game.activeStep;
      },
      set(value) {
        if (this.activeStep !== value)
          this.$emit('step', value);
      }
    }
  },

}
</script>
