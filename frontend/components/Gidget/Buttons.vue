<template>
  <div class="buttons has-addons">
    <!-- <button -->
    <!--   ref="explain" -->
    <!--   class="button" -->
    <!--   :disabled='isBusy' -->
    <!--   @click="$emit('click:explain')" -->
    <!-- > -->
    <!--   Explain Step -->
    <!-- </button> -->

    <button
      ref="step"
      class="button"
      :disabled='isBusy'
      @click="$emit('click:step')"
    >
      Next Step
    </button>

    <!-- <button -->
    <!--   ref="run" -->
    <!--   class="button" -->
    <!--   :disabled="isRunning" -->
    <!--   @click="$emit('click:run')" -->
    <!-- > -->
    <!--   Run -->
    <!-- </button> -->

    <!-- <button -->
    <!--   ref="stop" -->
    <!--   class="button" -->
    <!--   @click="$emit('click:stop')" -->
    <!-- > -->
    <!--   Stop -->
    <!-- </button> -->

    <button
      ref="toggle"
      v-text="toggleText"
      :class="toggleClass"
      @click="toggle"
    />

  </div>
</template>


<script>
export default {
  data() {
    return {
      // Button disabled states
      isRunning: false,
      isBusy: false,
    }
  },


  computed: {
    toggleClass() {
      return 'button ' + (this.isRunning ? 'is-danger' : 'is-success')
    },


    toggleText() {
      return this.isRunning ? 'Stop' : 'Run'
    }
  },


  methods: {
    /**
     *
     */
    reset() {
      this.isRunning = false;
      this.isBusy = false;
    },

    toggle() {
      // Not running? Run it
      if (!this.isRunning)
        this.$emit('click:run');

      // It is running so stop it
      else
        this.$emit('click:stop');
    }
  }
}
</script>
