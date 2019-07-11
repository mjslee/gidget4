import Messages from '@/constants/messages'


export default {
  exposed: {
    /**
     * Move in direction.
     */
    _move(addX, addY) {
      const move = this.object.move({
        x: this.object.position.x + addX,
        y: this.object.position.y + addY
      });

      if (!move)
        this.object.say({ text: Messages.Gidget.CANNOT_MOVE });
      else
        this.object.energy -= 20;
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
    },

    async goto(value) {
      const obj = this.object.world.getObject(value)
      if (obj)
        await this.object.walk(obj.position)
    }
  }
}
