<template>
  <span>
    <template v-for="(value, i) in internalText">
      <template v-if="typeof value === 'string'">{{ value }}</template>
      <br v-else-if="value[1] === 0" />
      <GidgetValue :literal="value[0]" :key="i" v-else-if="value[1] === 1" />
      <highlight-code lang="javascript" :key="i" v-else-if="value[1] === 2">{{ value[0] }}</highlight-code>
      <highlight-code inline lang="javascript" :key="i" v-else-if="value[1] === 3">{{ value[0] }}</highlight-code>
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
      const splits = this.text.split(/(\/\w+\/|```.*?```|`.*?`|\n)/g)

      // Loop over each element of the split text
      for (var i = splits.length - 1; i >= 0; i--) {
        // Type -1 will be ignored
        const type = -1;
        let charLen = 1;

        // Type 0 is a new character line \n
        if (splits[i] === '\n')
          type = 0;

        // Type 1 is a forward slash; wrap with GidgetValue
        else if (this.isSurrounded(splits[i], '/'))
          type = 1;

        // Type 2 is a triple backtick; wrap with vue-highlightjs
        else if (this.isSurrounded(splits[i], '```')) {
          charLen = 3;
          type = 2;
        }

        // Type 3 is a backtick; wrap with vue-highlightjs inline
        else if (this.isSurrounded(splits[i], '`'))
          type = 3;

        // Replace element with object that contains two of its own elements:
        // the string element with first and last characters removed, and type
        if (type > -1)
          splits[i] = [splits[i].slice(charLen, charLen * -1), type];
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
    isSurrounded(text, char) {
      return text.startsWith(char) && text.endsWith(char);
    }
  }
}
</script>
