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
        throw new Error("Can't reach!");

      return move;
    },

    /**
     * Move object one space to the left.
     */
    left() {
      this.object.say("I'm moving left!");
      return this._move(-1, 0);
    },

    /**
     * Move object one space to the left.
     */
    right() {
      return this._move(1, 0);
    },

    /**
     * Move object one space upwards.
     */
    up() {
      return this._move(0, -1);
    },

    /**
     * Move object one space upwards.
     */
    down() {
      return this._move(0, 1);
    }
  }
}
