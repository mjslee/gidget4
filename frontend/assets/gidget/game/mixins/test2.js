/**
 * This module is for the purpose of testing.
 */
export default {
  isSecondMixin: 2,

  exposed: {
    'get testProp'() {
      return JSON.stringify(2)
    },

    testOverride() {
      return 2
    },

    secondMixin() {
      return 2
    }
  }
}
