<template>
  <div>
    <p>
      {{ text }}
    </p>
    <div class="buttons has-addons">
      <b-button
        icon-left="chevron-left"
        :disabled='previousButtonDisabled'
        @click="previousMessage"
      >
        Prev
      </b-button>
      <b-button
        icon-right="chevron-right"
        :disabled='nextButtonDisabled'
        @click="nextMessage"
      >
        Next
      </b-button>
    </div>
  </div>
</template>


<style scoped>
.buttons {
  margin-top: 1rem;
  justify-content: center;
}
</style>


<script>
export default {
  props: {
    dialogue: { type: Object, default: () => {} }
  },


  data() {
    return {
      nextButtonDisabled: false,
      previousButtonDisabled: true,
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
      this.nextButtonDisabled = false;
      this.previousButtonDisabled = false;

      if (this.index <= 0)
        this.previousButtonDisabled = true;

      if (this.index >= this.messages.length - 1)
        this.nextButtonDisabled = true;
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
