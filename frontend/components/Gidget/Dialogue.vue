<template>
  <div>
    <p>
      <template v-if="!text.includes('`')">
        {{ text }}
      </template>
      <span v-else v-for="(word, index) in text.split(' ')" :key="word + index"><!--
     --><template v-if="word[0] === '`'"><!--
       --><GidgetValue :literal="word.substring(1)" /><!--
     --></template><!--
     --><template v-else>{{ word }}</template>&nbsp;<!--
   --></span>

      <span class="tag is-info is-rounded is-small" v-if="repeats > 0">
        {{ repeats + 1 }}
      </span>
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
import GidgetValue from './Value'


export default {
  props: {
    messages: {
      type: Array,
      default: () => []
    }
  },


  components: {
    GidgetValue
  },


  data() {
    return {
      text_: '',

      repeats: 0,
      index: 0,

      nextButtonDisabled: false,
      previousButtonDisabled: true
    };
  },


  mounted() {
    // Set level introduction messages
    if (this.messages.length > 0)
      this.nextMessage();
  },


  computed: {
    text: {
      /**
       * Get text value.
       *
       * @return {string}
       */
      get() {
        return this.text_
      },

      /**
       * Set text value. Increment or reset text repeat count.
       *
       * @param {string} newVal
       */
      set(newValue) {
        if (this.text === newValue)
          this.repeats += 1;
        else
          this.repeats = 0;

        this.text_ = newValue
      }
    }
  },


  watch: {
    /**
     * Reset index on messages change.
     */
    messages() {
      this.index = 0;

      // Sometimes index is already 0 so no change is made, meaning we have
      // to manually update the display text
      if (this.messages.length > 0)
        this.setMessage(this.messages[0]);

      this.setButtonStatus();
    },

    /**
     * Change display text on index change.
     *
     * @param {string} newVal
     */
    index(newVal) {
      this.setMessage(this.messages[newVal]);
      this.setButtonStatus();
    }
  },


  methods: {
    /**
     * Set dialogue box content and style.
     *
     * @param {object} message
     */
    setMessage(message) {
      if (typeof message === 'undefined')
        return;

      if (typeof message.text === 'string')
        this.text = message.text;
    },

    /**
     * Set next and previous button statuses.
     */
    setButtonStatus() {
      this.nextButtonDisabled = false;
      this.previousButtonDisabled = false;

      if (this.index < 0)
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
