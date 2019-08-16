/**
 * This module is for the purpose of testing.
 */
export default {
  isFirstMixin: 1,

  exposed: {
    'get testProp'() {
      return JSON.stringify(1)
    },

    testOverride() {
      return 1
    },

    firstMixin() {
      return 1
    }
  }
}
