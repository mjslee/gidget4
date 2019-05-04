<template>
  <div>
    {{ text }}
    <button ref="previousButton" @click="previousMessage">Prev</button>
    <button ref="nextButton" @click="nextMessage">Next</button>
  </div>
</template>


<script>
export default {
  props: {
    dialogue: { type: Object, default: () => {} }
  },


  data() {
    return {
      messages: [],
      index: 0,
      text: ''
    };
  },


  mounted() {
    // Set level introduction messages
    if (
      typeof this.dialogue !== 'undefined' &&
      Array.isArray(this.dialogue.introduction)
    ) {
      this.messages = this.dialogue.introduction;
      this.nextMessage();
    }
  },


  watch: {
    /**
     * Reset index on messages change.
     */
    messages() {
      this.index = 0;

      // Sometiems index is already 0 so no change is made, meaning we have
      // to manually update the display text
      this.setMessage(this.messages[0]);
      this.setButtonStatus();
    },

    /**
     * Change display text on index change.
     */
    index(newVal) {
      this.setMessage(this.messages[newVal]);
      this.setButtonStatus();
    }
  },


  methods: {
    /**
     * Set dialogue box content and style.
     */
    setMessage(message) {
      this.text = message.text;
    },

    /**
     * Set next and previous button statuses.
     */
    setButtonStatus() {
      this.$refs.nextButton.disabled = false;
      this.$refs.previousButton.disabled = false;

      if (this.index <= 0)
        this.$refs.previousButton.disabled = true;

      if (this.index >= this.messages.length - 1)
        this.$refs.nextButton.disabled = true;
    },

    /**
     * Set message to next message.
     */
    nextMessage() {
      if (this.index < this.messages.length - 1)
        this.index += 1;
    },

    /**
     * Set message to previous message.
     */
    previousMessage() {
      if (this.index > 0)
        this.index -= 1;
    },
  },
}
</script>
