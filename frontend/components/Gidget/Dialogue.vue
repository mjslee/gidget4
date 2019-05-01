<template>
  <div>
    {{ text }}
    <button
      ref="previousButton"
      @click="previousMessage"
      :style="buttonsVisible"
    >Prev</button>
    <button
      ref="nextButton"
      @click="nextMessage"
      :style="buttonsVisible"
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
      messages: [{ text: '1' }, { text: '2' }, { text: '3'}],
      index: -1,
      text: ''
    };
  },


  mounted() {
    if (typeof this.dialogue !== 'undefined')
      if (typeof this.dialogue.intro !== 'undefined')
        this.messages = this.dialogue.intro;
  },

  computed: {
    buttonsVisible() {
      let display;
      if (this.messages.length > 0)
        display = 'inline-block';
      else
        display = 'none';
      return { display };
    }
  },


  methods: {
    /**
     *
     */
    setMessages(messages) {
      this.index = 0;
      this.messages = messages;
    },

    /**
     *
     */
    setMessage(message) {
      this.text = message.text;
    },

    /**
     *
     */
    nextMessage() {
      if (this.index < this.messages.length - 1)
        this.setMessage(this.messages[++this.index]);
    },

    /**
     *
     */
    previousMessage() {
      this.$refs.nextButton.disabled = false;

      if (this.index > 0)
        this.setMessage(this.messages[--this.index]);
      else
        this.$refs.previousButton.disabled = true;
    },
  },
}
</script>
