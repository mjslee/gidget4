/*
 * This module is for the purpose of testing.
 */
export default {
  isObject: true,

  exposed: {
    /**
     * This should be overriden by the 'Test' mixin.
     */
    testOverride() {
      return 0
    },
  }
}
