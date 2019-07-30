import { PATTERNS, TRANSLATIONS } from '@/constants/exceptions'


export default {
  /*
   * Parse exception message to get a exception message translation match.
   *
   * @param {string} message
   * @return {object}
   */
  parse(message) {
    for (const pattern in PATTERNS) {
      const matches = message.match(PATTERNS[pattern])

      // We have a match... return the pattern name
      if (matches && matches.length > 0) {
        return { match: pattern, matches }
      }
    }
  },


  /*
   * Translate an exception message.
   *
   * @param {string} message
   * @return {string}
   */
  translate(message) {
    const parsedMessage = this.parse(message)
    if (typeof parsedMessage == 'undefined')
      return

    let translation = TRANSLATIONS[parsedMessage.match]
    if (typeof translation == 'undefined')
      return

    const token = parsedMessage.matches[1]
    translation = translation.replace(/{}/g, token || '')

    return translation.trim()
  },
}
