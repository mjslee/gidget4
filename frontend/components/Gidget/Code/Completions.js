export default {
  computed: {
    editor() {
      return undefined;
    }
  },

  methods: {
    /**
     * Get tokens on line.
     *
     * @param {number} line
     * @return {array[object[index,token]]}
     */
    getTokens(line) {
      let i = 0;
      return this.editor.getLineTokens(line).map((t) => ({ index: i++, ...t }));
    },

    /**
     * Get the keys from a token's string.
     * Looks ahead of given token.
     *
     *   Cat[0] => '[0]'
     *   Cat[0][1] => '[0][1]'
     *   Cat[Dog[0]][1] => '[Dog[0]][1]'
     *
     * @param {array} tokens
     * @param {object} token
     * @return {string}
     */
    getTokenKeys(tokens, token) {
      let result = '';
      let openBrackets = 0;

      for (let i = token.index + 1, len = tokens.length; i < len; i++) {
        token = tokens[i];
        if (!token)
          break;

        // Open brackets
        else if (token.string == '[')
          openBrackets++;

        // Close brackets; cannot close if never opened
        else if (token.string == ']' && openBrackets > 0)
          openBrackets--;

        // When all brackets have been closed we are finished
        else if (openBrackets <= 0)
          break;

        result += token.string;
      }

      return result;
    },

    /**
     * Get chain of tokens that create an expression.
     * Looks behind the token.
     *
     *   Cat[0].walk()        => ['Cat[0]', 'walk']
     *   Cat[0][1].position.x => ['Cat[0][1]', 'position', 'x']
     *   Cat[Dog[0]].walk()   => ['Cat[Dog[0]]', 'walk']
     *
     * @param {number} line
     * @param {number} ch
     * @return {object[result,hasDot,start,end]}
     */
    getTokenChain(line, ch) {
      const result = [];
      const tokens = this.getTokens(line);
      if (!tokens.length)
        return;

      let index = tokens.findIndex((t) => ch <= t.end);

      // Get property if ending with a dot
      if (tokens[index+1] && tokens[index].string == '.')
        index++;

      let hasDot = tokens[index].string == '.';
      let start  = tokens[index].start;
      let end    = tokens[index].end;
      let openBrackets = 0;

      // Work backwards to get all preceding tokens
      for (let i = index; i >= 0; i--) {
        const token = tokens[i];
        if (!token)
          break;

        // Entered the brackets
        else if (token.string == ']')
          openBrackets++;

        // Exited the brackets
        else if (token.string == '[' && openBrackets > 0)
          openBrackets--;

        else if (token.type == 'property' || token.type == 'variable') {
          // If we are inside brackets, ignore duplicates
          if (openBrackets > 0)
            continue;

          start = token.start;
          result.unshift(token.string + this.getTokenKeys(tokens, token));
        }

        if (token.type == 'variable' && openBrackets <= 0)
          break;
      }

      return { result, hasDot, start, end };
    },
  }
};
