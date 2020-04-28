<template>
  <article class="container" v-if="dialogue">
    <img class="left head image is-64x64" :src="spriteSrc" v-if="spriteSrc">

    <section class="box">
      <!-- Dialogue Progress -->
      <b-progress
        type="is-primary"
        :value="index"
        :max="length"
        show-value
      >
        Message {{ index }} out of {{ length }}
      </b-progress>

      <!-- Dialogue -->
      <div class="media">
        <!-- Text -->
        <div class="media-content">
          <markdown :value="text" />
        </div>

        <div class="media-right">
          <div class="buttons has-addons is-centered">
            <!-- Previous Button -->
            <b-button
              icon-left="chevron-left"
              :disabled="!hasPrevious"
              @click="previous"
            />

            <!-- Next Button -->
            <b-button
              type="is-primary"
              icon-right="chevron-right"
              :disabled="!hasNext"
              @click="next"
            />
          </div>
        </div>
      </div>

      
      <!-- <div class="buttons has&#45;addons is&#45;centered"> -->
      <!--   {{ index }}/{{ length }} -->
      <!--  -->
      <!-- </div> -->
    </section>
  </article>
</template>


<style scoped>
.container {
  position: relative;
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

.progress-wrapper {
  margin: -1rem -1rem 0.5rem -1rem;
  text-shadow: 0 0 0.1rem #000;
}
</style>


<script>
import GidgetValue from '../Content/Value';
import Markdown from '../Content/Markdown';
import { SPRITE_PATH } from '@/constants/paths';


export default {
  components: {
    GidgetValue,
    Markdown
  },

  watch: {
    length(newValue) {
      this.$store.commit('dialogue/setIndex', newValue);
    }
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
    spriteSrc() {
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
