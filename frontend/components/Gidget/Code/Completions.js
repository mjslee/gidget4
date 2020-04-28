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

    /**
     * Get active token and cursor from CodeMirror editor.
     *
     * @return {object[cursor,token]}
     */
    getCursor() {
      const cursor = this.editor.getCursor();
      if (cursor.ch == 0)
        cursor.ch = 1;

      return { cursor, token: this.editor.getTokenAt(cursor) };
    },

    /**
     * Get array of game completions from game state for the CodeMirror editor.
     *
     * @return {object}
     */
    getCompletions() {
      const { cursor, token } = this.getCursor();

      // Disallow completions if cursor is behind the token's end
      if (cursor.ch < token.end)
        return;

      // Beginning of line
      // TODO: Snippets
      if (token.string == '')
        return;

      // Variable and property completions
      if (token.string == '.' || token.type == 'variable' ||
        token.type == 'property')
        return this.getValueCompletions(cursor);
    },

    /**
     * Get completions based on value of token chain.
     *
     * @return {object}
     */
    getValueCompletions(cursor) {
      // Get evaluated code state
      const state = this.$store.state.game.evalData;
      if (!state)
        return;

      // Get token chain behind the current cursor position
      // When no tokens, show all top-level state variables
      const tokens = this.getTokenChain(cursor.line, cursor.ch);
      if (!tokens)
        return this.buildCompletions(state, false);

      // Get value from state.
      let value = _.get(state, tokens.result.join('.'));
      let needsDot = !tokens.hasDot;

      // No value? Filter props based on current text
      let filteredText;
      if (!value) {
        // Set second to last token as value if our text doesn't end with a dot
        if (needsDot) {
          value = _.get(state, _.nth(tokens.result, -2));
          needsDot = false;
        }

        // Do not get properties for an undefined token value
        if (!value && (tokens.hasDot || tokens.result.length > 1))
          return;

        // Last token is the partial text we should filter for
        filteredText = _.last(tokens.result);
      }

      // Build completion list from returned value of variable or property
      return this.buildCompletions(value || state, needsDot, filteredText);
    },

    /**
     * Build completions from an object's keys./
     *
     * @param {object} value
     * @param {string} filterText
     * @return {object}
     */
    buildCompletions(value, prependDot=false, filterText=undefined) {
      const { cursor, token } = this.getCursor();

      // Build completions array
      const completions = Object.keys(value).filter((option) => {
        // Ignore internal properties
        if (option.startsWith('get ') || option === 'isEnclosed')
          return false;

        // Partial matching
        if (filterText)
          return option.includes(filterText);

        return true;
      }).map((option) => {
        if (!isNaN(option))
          return '[' + option + ']';

        if (prependDot)
          option = '.' + option;

        return option;
      });

      const line = cursor.line;
      return {
        list : completions,
        from : { line, ch: filterText ? token.start : token.end },
        to   : { line, ch: token.end },
      };
    },

    /**
     * Get the active token chain.
     *
     * @return {array}
     */
    getActiveTokens() {
      const { cursor } = this.getCursor();
      return this.getTokenChain(cursor.line, cursor.ch);
    }
  }
};
