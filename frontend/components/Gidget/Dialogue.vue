<template>
  <div style="position:relative">
    <img class="left head image is-64x64" :src="leftImage" v-if="leftImage">
    <img class="right head image is-64x64" :src="rightImage" v-if="rightImage">

    <div class="box">
      <template>
        <!-- Markdown -->
        <GidgetText :text="message.text" v-if="message" />


        <!-- Message Repeats -->
        <span class="tag is-info is-rounded is-small" v-if="message.repeats">
          {{ message.repeats }}
        </span>
      </template>

      <div class="buttons has-addons is-centered">
        <!-- Previous Message -->
        <b-button
          icon-left="chevron-left"
          :disabled="!hasPrev"
          @click="prev"
        >
          Prev
        </b-button>

        <!-- Next Message -->
        <b-button
          type="is-primary"
          icon-right="chevron-right"
          :disabled="!hasNext"
          @click="next"
        >
          Next
        </b-button>

        <!-- <span>&#38;nbsp;{{ index }}/{{ messages.length &#45; 1 }}</span> -->
      </div>
    </div>
  </div>
</template>


<style scoped>
.buttons {
  margin-top: 1rem;
}

.box {
  position: absolute;
  top: 0;
  width: 100%;
}

@keyframes slide-up {
  from { top: 0 }
  to { top: -3em }
}

.head {
  position: absolute;
  top: -3em;
  animation-name: slide-up;
  animation-duration: 250ms;
}

.left.head {
  transform: rotate(-5deg);
}

.right.head {
  right: 0;
  transform: rotate(5deg);
  animation-duration: 750ms;
}
</style>


<script>
import _ from 'lodash'
import GidgetValue from './Value'
import GidgetText from './Text'
import { SPRITE_PATH } from '@/constants/paths'


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
      messageIndex: 0,
      internalMessages: this.messages,

      isSuccess: false,
      isFailure: false
    }
  },


  computed: {
    /**
     *
     */
    message() {
      return this.internalMessages[this.messageIndex] || {}
    },

    /**
     *
     */
    hasPrev() {
      return this.messageIndex > 0
    },

    /**
     *
     */
    hasNext() {
      return this.messageIndex < this.internalMessages.length - 1
    },

    /**
     *
     */
    rightImage() {
      if (this.message.rightImage)
        return SPRITE_PATH + this.message.rightImage
    },

    /**
     *
     */
    leftImage() {
      if (this.message.leftImage)
        return SPRITE_PATH + this.message.leftImage
    }
  },


  watch: {
    /**
     *
     */
    messages(newVal, oldVal) {
      if (!Array.isArray(newVal))
        return

      this.internalMessages = _.cloneDeep(newVal)
      this.messageIndex = _.isEmpty(oldVal) ? 0 : newVal.length - 1
    }
  },


  methods: {
    /**
     * Reset dialogue to initial messages.
     */
    reset() {
      this.messageIndex = 0
    },

    /**
     * Set dialogue box content and style.
     *
     * @param {array[object]} messages
     * @return {void}
     */
    set(messages, index=-1) {
      this.$nextTick(() => {
        this.internalMessages = messages
        this.messageIndex = index >= 0 ? index : messages.length - 1
      })
    },


    /**
     *
     */
    append(message) {
      this.$nextTick(() => {
        this.internalMessages.push(message)
        this.messageIndex = this.internalMessages.length - 1
      })
    },


    /**
     * Load next message by incrementing index.
     *
     * @return {void}
     */
    next() {
      if (this.hasNext)
        this.messageIndex += 1
    },


    /**
     * Load previous message by decrementing index.
     *
     * @return {void}
     */
    prev() {
      if (this.hasPrev)
        this.messageIndex -= 1
    },
  },
}
</script>
