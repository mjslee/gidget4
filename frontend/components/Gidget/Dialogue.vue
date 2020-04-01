<template>
  <div class="container" v-if="dialogue">
    <img class="left head image is-64x64" :src="sprite" v-if="sprite">

    <div class="box">
      <!-- Markdown -->
      <gidget-text :text="text" />

      <div class="buttons has-addons is-centered">
        <!-- Previous Message -->
        <b-button
          icon-left="chevron-left"
          :disabled="!hasPrevious"
          @click="previous"
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
        {{ index }}/{{ length }}

      </div>
    </div>
  </div>
</template>


<style scoped>
.container {
  position: relative;
}

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
</style>


<script>
import GidgetValue from './Value';
import GidgetText from './Text';
import { SPRITE_PATH } from '@/constants/paths';


export default {

  components: {
    GidgetValue,
    GidgetText
  },


  computed: {
    /*
     * Get active dialogue index.
     *
     * @return {number}
     */
    index() {
      return this.$store.state.dialogue.activeIndex;
    },

    /*
     * Get active dialogue message.
     *
     * @return {object}
     */
    dialogue() {
      return this.$store.getters['dialogue/getActiveDialogue'];
    },

    /*
     * Get text from dialogue message.
     *
     * @return {string}
     */
    text() {
      return this.dialogue.text;
    },

    /*
     * Get length of dialogue messages array.
     *
     * @return {number}
     */
    length() {
      return this.$store.getters['dialogue/getLength'];
    },

    /*
     * Does a next dialogue message exist?
     *
     * @return {boolean}
     */
    hasNext() {
      return this.$store.getters['dialogue/hasNext'];
    },

    /*
     * Does a previous dialogue message exist?
     *
     * @return {boolean}
     */
    hasPrevious() {
      return this.$store.getters['dialogue/hasPrevious'];
    },

    /**
     * Get URL to sprite when applicable.
     *
     * @return {string}
     */
    sprite() {
      if (this.dialogue.sprite)
        return SPRITE_PATH + this.dialogue.sprite + '.png';
    }
  },

  methods: {
    /*
     * Set next message.
     *
     * @return {void}
     */
    next() {
      this.$store.dispatch('dialogue/next');
    },

    /*
     * Set previous message.
     *
     * @return {void}
     */
    previous() {
      this.$store.dispatch('dialogue/previous');
    }
  }
}
</script>
