export default {
  exposed: {

    /**
     * Move in direction.
     */
    _move(addX, addY) {
      const move = this.object.move(
        this.object.position.x + addX, this.object.position.y + addY
      );

      if (!move)
        this.object.say({ text: "I can't reach!" });
    },

    /**
     * Say directional move.
     * "I'm moving left!" || "I'm moving 2 spaces left!"
     */
    _moveSay(direction, amount) {
      const spaces = amount == 1 ? '' : `${amount} spaces ` ;
      this.object.say({ text: `I'm moving ${spaces}${direction}!` });
    },

    /**
     * Move object one space to the left.
     */
    left(amount=1) {
      this._moveSay('left', amount);
      this._move(amount * -1, 0);
    },

    /**
     * Move object one space to the left.
     */
    right(amount=1) {
      this._moveSay('right', amount);
      this._move(amount, 0);
    },

    /**
     * Move object one space upwards.
     */
    up(amount=1) {
      this._moveSay('up', amount);
      this._move(0, amount * -1);
    },

    /**
     * Move object one space upwards.
     */
    down(amount=1) {
      this._moveSay('down', amount);
      this._move(0, amount);
    }
  }
}
