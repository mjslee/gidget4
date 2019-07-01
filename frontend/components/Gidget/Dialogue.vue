<template>
  <div>
    <p>
      <GidgetText :text="text" />
      <span class="tag is-info is-rounded is-small" v-if="repeats > 0">
        {{ repeats + 1 }}
      </span>
    </p>
    <div class="buttons has-addons is-centered">
      <b-button
        icon-left="chevron-left"
        :disabled="prevButtonDisabled"
        @click="prevMessage"
      >
        Prev
      </b-button>
      <b-button
        icon-right="chevron-right"
        :disabled="nextButtonDisabled"
        @click="nextMessage"
      >
        Next
      </b-button>

      <b-button @click="$emit('click:reset')">
        <b-icon icon="restart"></b-icon>
      </b-button>
    </div>
  </div>
</template>


<style scoped>
.buttons {
  margin-top: 1rem;
}
</style>


<script>
import _ from 'lodash'
import GidgetValue from './Value'
import GidgetText from './Text'


export default {
  props: {
    messages: {
      type: Array,
      default: () => []
    }
  },


  components: {
    GidgetValue,
    GidgetText
  },


  data() {
    return {
      internalText: '',

      repeats: 0,
      index: 0,

      nextButtonDisabled: false,
      prevButtonDisabled: true
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
        return this.internalText
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

        this.internalText = newValue
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
      this.prevButtonDisabled = false;

      if (this.index <= 0)
        this.prevButtonDisabled = true;

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
    prevMessage() {
      if (this.index > 0)
        this.index -= 1;
    },
  },
}
</script>
