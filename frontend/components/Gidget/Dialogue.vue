<template>
  <div>
    {{ text }}
    <button
      ref="previousButton"
      @click="previousMessage"
      :style="buttonStyle"
    >Prev</button>
    <button
      ref="nextButton"
      @click="nextMessage"
      :style="buttonStyle"
    >Next</button>
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
      index: -1,
      text: ''
    };
  },


  mounted() {
    // Set introduction messages
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
    },

    /**
     * Change display text on index change.
     */
    index(newVal) {
      this.text = this.messages[newVal];
    }
  },


  computed: {
    /**
     * Style object of next and previous buttons.
     */
    buttonStyle() {
      if (typeof this.messages === 'undefined')
        return { display: 'none' };

      const display = this.messages.length > 0 ? 'inline-block' : 'none';
      return { display };
    }
  },


  methods: {
    /**
     * Set next and previous button statuses.
     */
    setButtonStatus() {
      this.$refs.nextButton.disabled = false;
      this.$refs.previousButton.disabled = false;

      if (this.index <= 0)
        this.$refs.previousButton.disabled = true;

      else if (this.index >= this.messages.length - 1)
        this.$refs.nextButton.disabled = true;
    },

    /**
     * Set message to next message.
     */
    nextMessage() {
      if (this.index < this.messages.length - 1)
        this.index += 1;
        //this.text = this.messages[++this.index];

      this.setButtonStatus();
    },

    /**
     * Set message to previous message.
     */
    previousMessage() {
      if (this.index > 0)
        this.index -= 1;
        //this.text = this.messages[--this.index];

      this.setButtonStatus();
    },
  },
}
</script>
