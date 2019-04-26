/*
 * This module is for the purpose of testing.
 */
export default {
  exposed: {
    isMixin: true,

    /**
     * This should override 'testOverride' of the Test object.
     */
    testOverride() {
      return true;
    },
  }
}
