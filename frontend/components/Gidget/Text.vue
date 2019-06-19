<template>
  <span>
    <template v-for="(value, i) in internalText">
      <template v-if="typeof value === 'string'">{{ value }}</template>
      <GidgetValue :literal="value[0]" :key="i" v-else-if="value[1] === 0" />
      <highlight-code inline lang="javascript" :key="i" v-else-if="value[1] === 1">{{ value[0] }}</highlight-code>
    </template>
  </span>
</template>


<script>
import GidgetValue from './Value'

export default {
  components: {
    GidgetValue
  },

  props: {
    text: String,
  },

  computed: {
    /**
     * Split text into an array with strings and objects.
     * Content wrapped in backticks (`example`) will render inline code.
     * Content wrapped in forward slashes (/example/) will render GidgetValue
     * components.
     *
     * @return {array}
     */
    internalText() {
      // Split text by backtick or forward slash surroundings
      const splits = this.text.split(/(\/\w+\/|`.*?`)/g)

      // Loop over each element of the split text
      for (var i = splits.length - 1; i >= 0; i--) {
        // Type -1 will be ignored
        const type = -1;

        // Type 0 is a forward slash; wrap with GidgetValue
        if (this.isCharacterSurrounding(splits[i], '/'))
          type = 0;

        // Type 1 is a backtick; wrap with vue-highlightjs
        else if (this.isCharacterSurrounding(splits[i], '`'))
          type = 1;

        // Replace element with object that contains two of its own elements:
        // the string element with first and last characters removed, and type
        if (type > -1)
          splits[i] = [splits[i].slice(1, -1), type];
      }

      return splits;
    }
  },

  methods: {
    /**
     * Determine if text is surrounded by a specified character.
     *
     * @param {string} text
     * @param {string} char
     */
    isCharacterSurrounding(text, char) {
      return text.charAt(0) === char && text.charAt(text.length - 1) === char;
    }
  }
}
</script>
