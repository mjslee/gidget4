import Messages from '@/constants/messages'


export default {
  /**
   * Move in direction.
   */
  _move(addX, addY) {
    const move = this.move(
      this.position.x + addX, this.position.y + addY
    );

    if (!move)
      this.say({ text: Messages.Gidget.CANNOT_MOVE });
    else
      this.energy -= 20;
  },


  /**
   * Say directional move.
   * "I'm moving left!" || "I'm moving 2 spaces left!"
   */
  _moveSay(direction, amount) {
    const spaces = amount == 1 ? '' : `${amount} spaces ` ;
    this.say({ text: `I'm moving ${spaces}${direction}!` });
  },


  exposed: {
    /**
     * Move object one space to the left.
     */
    left(amount=1) {
      this.object._moveSay('left', amount);
      this.object._move(amount * -1, 0);
    },

    /**
     * Move object one space to the left.
     */
    right(amount=1) {
      this.object._moveSay('right', amount);
      this.object._move(amount, 0);
    },

    /**
     * Move object one space upwards.
     */
    up(amount=1) {
      this.object._moveSay('up', amount);
      this.object._move(0, amount * -1);
    },

    /**
     * Move object one space upwards.
     */
    down(amount=1) {
      this.object._moveSay('down', amount);
      this.object._move(0, amount);
    },

    /**
     *
     */
    grab(value) {
      this.object.grab(value);
    },

    /**
     *
     */
    drop(value) {
      this.object.drop(value);
    }
  }
}
