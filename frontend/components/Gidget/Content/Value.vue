<template>
  <span>
    <!-- Literal -->
    <a @click="togglePopover" v-if="realType != 'object' || type == 'Null'">
      <highlight :value="value" />
    </a>

    <!-- Identifier -->
    <a @click="togglePopover" v-else-if="identifier && !displayValue">
      <highlight :value="identifier" />
    </a>

    <!-- Position -->
    <template v-else-if="type == 'Position'">
      &#91; 
      <a @click="isActive = !isActive">
        <highlight :value="`${value.x},${value.y}`" />
      </a>
      &#93;
    </template>

    <!-- GameObject -->
    <a @click="togglePopover" v-else-if="type == 'GameObject'">
      <img
        class="image is-24x24"
        style="display:inline"
        :src="spriteSrc"
        v-if="spriteSrc"
        />
      <highlight :value="identifier" v-if="identifier" />
    </a>

    <!-- Generic Object -->
    <a @click="togglePopover" v-else-if="type == 'Object'">
      <highlight value="[Object]" />
    </a>
    
    <!-- Array -->
    <template v-else-if="type == 'Array'">
      &#91;
      <template v-for="(val, i) in value">
        <Value :code="val" :key="i" />
        <span class="comma" v-if="i + 1 < value.length">, </span>
      </template>
      &#93;
    </template>

    <!-- Insight -->
    <popover v-if="isActive" :active.sync="isActive" :parent-element="$el">
      <insight :code="internalCode" />
    </popover>
  </span>
</template>


<style scoped>
.comma {
  margin-left: -0.15rem;
}
</style>


<script>
import Highlight from './Highlight';
import Popover from './Popover';
import Insight from './Insight';
import Type from './Type';
import { ObjectSprite } from '@/constants/sprites';

export default {
  name: 'Value',

  components: {
    Highlight,
    Popover,
    Insight
  },

  mixins: [
    Type
  ],

  computed: {
    /**
     * Sprite of game object.
     *
     * @return {string}
     */
    spriteSrc() {
      return this.type == 'GameObject' && ObjectSprite(this.value.sprite);
    }
  },

  data() {
    return {
      isActive: false,
    }
  },

  methods: {
    /**
     * Toggle visiblity of popover.
     *
     * @return {void}
     */
    togglePopover() {
      this.isActive = !this.isActive;
    }
  }

}
</script>
