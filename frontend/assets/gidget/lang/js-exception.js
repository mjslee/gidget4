const Patterns = {
  NOT_A_FUNCTION: /(.*?) is not a function$/,
  UNDEFINED: /(.*?) is undefined$/,
  NOT_DEFINED: /(.*?) is not defined$/,
  HAS_NO_PROPERTIES: /(.*?) has no properties$/,
  UNEXPECTED_TOKEN: /^Unexpected token (.*?)$/,
  UNEXPECTED_STRING: /^Unexpected string$/,
  UNEXPECTED_NUMBER: /^Unexpected number$/,
  UNEXPECTED_IDENTIFIER: /^Unexpected identifier$/,
}


export default {
  parse(message) {
    for (const pattern in Patterns) {
      const matches = message.match(Patterns[pattern]);

      // We have a match... return the pattern name
      if (matches && matches.length > 0) {
        return {
          match: pattern,
          matches
        };
      }
    }
  },


  translate(message, constants) {
    const parsedMessage = this.parse(message);
    if (typeof parsedMessage === 'undefined')
      return;

    let translation = constants[parsedMessage.match];
    if (typeof translation === 'undefined')
      return;

    const token = parsedMessage.matches[1]
    console.log(parsedMessage)
    translation = translation.replace(/{}/g, token || '')

    return translation.trim();
  },
}
