<template>
  <div class="container" v-if="message">
    <img class="left head image is-64x64" :src="sprite" v-if="sprite">

    <div class="box">
      <template v-if="message">
        <!-- Markdown -->
        <gidget-text :text="message.text" />
      </template>

      <div class="buttons has-addons is-centered">
        <!-- Previous Message -->
        <b-button
          icon-left="chevron-left"
          :disabled="!hasPrev"
          @click="index--"
        >
          Prev
        </b-button>

        <!-- Next Message -->
        <b-button
          type="is-primary"
          icon-right="chevron-right"
          :disabled="!hasNext"
          @click="index++"
        >
          Next
        </b-button>

        <span>&nbsp;{{ index }}/{{ messages.length - 1 }}</span>
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
  props: {
    messages: {
      type: Array
    }
  },


  components: {
    GidgetValue,
    GidgetText
  },


  data() {
    return {
      index: 0
    }
  },


  computed: {
    /**
     * Active message.
     */
    message() {
      if (typeof this.index != 'number') {
        this.index = 0;
        return;
      }

      if (this.index < 0) {
        this.index = 0;
        return;
      }

      return this.messages[this.index];
    },

    /**
     * Does a previous message exist?
     */
    hasPrev() {
      return this.index > 0;
    },

    /**
     * Does a next message exist?
     */
    hasNext() {
      return this.index < this.messages.length - 1;
    },

    /**
     * Get url to left-side sprite if applicable.
     */
    sprite() {
      if (this.message && this.message.sprite)
        return SPRITE_PATH + this.message.sprite + '.png';
    }
  }
}
</script>
