/* 
This mixin is used to reference all non controllable objects within the world
*/

export default {
  exposed: {
    isMixin: true,
  },

  /**
   * This should override 'testOverride' of the Test object.
   */
  objectOverride() {
    return true
  },
}