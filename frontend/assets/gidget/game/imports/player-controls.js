export default {


  hello() {
    const gidget = this.getObject('Gidget')
    gidget.say({ text: 'hello', type: 'dialogue' })
  },

  /**
   * Move up.
   */
  up() {
    const gidget = this.getObject('Gidget')
    if (gidget)
      gidget.exposed.up(...arguments)
  },

  /**
   * Move down.
   */
  down() {
    const gidget = this.getObject('Gidget')
    if (gidget)
      gidget.exposed.down(...arguments)
  },

  /**
   * Move left.
   */
  left() {
    const gidget = this.getObject('Gidget')
    if (gidget)
      gidget.exposed.left(...arguments)
  },

  /**
   * Move right.
   */
  right() {
    const gidget = this.getObject('Gidget')
    if (gidget)
      gidget.exposed.right(...arguments)
  },

  /**
   * Grab object.
   */
  grab() {
    const gidget = this.getObject('Gidget')
    if (gidget)
      gidget.exposed.grab(...arguments)
  },

  /**
   * Drop object.
   */
  drop() {
    const gidget = this.getObject('Gidget')
    if (gidget)
      gidget.exposed.drop(...arguments)
  }

}
