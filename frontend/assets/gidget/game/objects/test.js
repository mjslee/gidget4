/*
 * This module is for the purpose of testing.
 */
export default {
  exposed: {
    isType: true,

    /**
     * This should be overriden by the 'Test' mixin.
     */
    testOverride() {
      return false;
    },
  }
}
