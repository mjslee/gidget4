<template>
  <div style="position:relative">
    <img class="left head image is-64x64" :src="leftImage" v-if="leftImage">
    <img class="right head image is-64x64" :src="rightImage" v-if="rightImage">
    <div class="box">
      <b-button
        icon-right="restart"
        class="is-pulled-right"
        @click="reset"
      >
      </b-button>

      <template>
        <GidgetText :text="message.text" v-if="message" />
        <span class="tag is-info is-rounded is-small" v-if="repeats > 0">
          {{ repeats + 1 }}
        </span>
      </template>

      <div class="buttons has-addons is-centered">
        <b-button
          icon-left="chevron-left"
          :disabled="!hasPrev"
          @click="prev"
        >
          Prev
        </b-button>

        <b-button
          type="is-primary"
          icon-right="chevron-right"
          :disabled="!hasNext"
          @click="next"
        >
          Next
        </b-button>
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
      // Clone initial messages so we can restore them whenever
      initialMessages: _.cloneDeep(this.messages),
      internalMessages: [],

      index: 0,
      repeats: 0,

      isSuccess: false,
      isFailure: false
    }
  },


  mounted() {
    // Set level introduction messages
    // if (this.internalMessages.length > 0)
    //   this.nextMessage()
  },


  computed: {
    message() {
      return this.internalMessages[this.index] || {}
    },

    hasPrev() {
      return this.index > 0
    },

    hasNext() {
      return this.index < this.internalMessages.length - 1
    },

    rightImage() {
      if (this.message.rightImage)
        return SPRITE_PATH + this.message.rightImage
    },

    leftImage() {
      if (this.message.leftImage)
        return SPRITE_PATH + this.message.leftImage
    }
  },


  watch: {
    messages: {
      handler(newVal) {
        if (Array.isArray(newVal) && newVal.length > 0)
          this.internalMessages = _.cloneDeep(newVal)
      },
      deep: true
    }
  },


  methods: {
    /**
     * Reset dialogue to initial messages.
     */
    reset() {
      this.internalMessages = _.cloneDeep(this.initialMessages)
      this.index = 0
      this.repeats = 0
    },

    /**
     * Set dialogue box content and style.
     *
     * @param {array[object]} messages
     * @return {void}
     */
    set(messages) {
      this.internalMessages = messages
      this.index = 0
    },


    append(message) {
      this.internalMessages.push(message)
      this.index = this.internalMessages.length - 1
    },


    /**
     * Load next message by incrementing index.
     *
     * @return {void}
     */
    next() {
      if (this.hasNext)
        this.index += 1
    },


    /**
     * Load previous message by decrementing index.
     *
     * @return {void}
     */
    prev() {
      if (this.hasPrev)
        this.index -= 1
    },
  },
}
</script>
