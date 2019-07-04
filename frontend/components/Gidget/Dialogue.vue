<template>
  <div>
    <b-button
      icon-right="restart"
      class="is-pulled-right"
      @click="reset"
    >
    </b-button>

    <template>
      <GidgetText :text="text" />
      <span class="tag is-info is-rounded is-small" v-if="repeats > 0">
        {{ repeats + 1 }}
      </span>
    </template>

    <div class="buttons has-addons is-centered">
      <b-button
        icon-left="chevron-left"
        :disabled="prevDisabled"
        @click="prevMessage"
      >
        Prev
      </b-button>
      <b-button
        type="is-primary"
        icon-right="chevron-right"
        :disabled="nextDisabled"
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
      initialMessages: _.clone(this.messages),

      internalMessages: [],
      internalText: '',

      index: 0,
      repeats: 0,
    }
  },


  mounted() {
    // Set level introduction messages
    if (this.internalMessages.length > 0)
      this.nextMessage()
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
          this.repeats += 1
        else
          this.repeats = 0

        this.internalText = newValue
      }
    },

    /**
     * Determine if next button should be disabled.
     *
     * @return {boolean}
     */
    nextDisabled() {
      return this.index >= this.internalMessages.length - 1
    },

    /**
     * Determine if previous button should be disabled.
     *
     * @return {boolean}
     */
    prevDisabled() {
      return this.index <= 0
    },
  },


  watch: {
    /**
     * Update internal messages.
     */
    messages() {
      this.internalMessages = this.messages
    },

    /**
     * Reset index on messages change.
     */
    internalMessages() {
      this.index = 0

      // Sometimes index is already 0 so no change is made, meaning we have
      // to manually update the display text
      if (this.internalMessages.length > 0)
        this.setMessage(this.internalMessages[0])
    },

    /**
     * Change display text on index change.
     *
     * @param {string} newVal
     */
    index(newVal) {
      this.setMessage(this.internalMessages[newVal])
    }
  },


  methods: {
    /**
     * Reset dialogue to initial messages.
     */
    reset() {
      this.internalMessages = _.clone(this.initialMessages)
      this.repeats = -1
    },

    /**
     * Set dialogue box content and style.
     *
     * @param {object} message
     */
    setMessage(message) {
      if (typeof message === 'undefined')
        return

      if (typeof message.text === 'string')
        this.text = message.text
    },

    /**
     * Set message to next message.
     */
    nextMessage() {
      if (this.index < this.internalMessages.length - 1)
        this.index += 1
    },

    /**
     * Set message to previous message.
     */
    prevMessage() {
      if (this.index > 0)
        this.index -= 1
    },
  },
}
</script>
