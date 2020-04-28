<template>
  <span>
    <a @click="isPopoverActive = !isPopoverActive">
      <highlight :value="value" />
    </a>

    <popover :active.sync="isPopoverActive" :element="$el">
      <markdown :value="definition" />
    </popover>
  </span>
</template>


<script>
import Highlight from './Highlight';
import Popover from './Popover';
import Explorer from './Explorer';
import Markdown from './Markdown';
import StringDefinition from '@/assets/gidget/game/definitions/string.js';

export default {
  name: 'Literal',

  components: { Highlight, Popover, Explorer, Markdown },

  props: {
    value: Array | Object | String | Boolean | Number
  },

  data() {
    return {
      isPopoverActive: false,
      definition: StringDefinition
    }
  }
}
</script>
