import { GIDGET_MESSAGES } from '@/constants/messages'


export default {
  /**
   * Move object relative to its current position.
   */
  relativeWalk(direction, amount, position) {
    position.x += this.position.x;
    position.y += this.position.y;
    const move = this.walk(position);

    // Cannot move
    if (!move) {
      this.say({
        type: 'dialogue',
        sprite: 'gidget',
        text: GIDGET_MESSAGES.CANNOT_MOVE
      });
    }

    // Can move
    else {
      const spaces = amount == 1 ? '' : `${amount} spaces` ;
      this.say({
        type: 'dialogue',
        sprite: 'gidget',
        text: `I'm moving ${spaces} ${direction}!`
      });
    }
  },

  exposed: {
    /**
     * Move object one space to the left.
     */
    left(amount=1) {
      return this.relativeWalk('left', amount, { x: amount * -1, y: 0 });
    },

    /**
     * Move object one space to the right.
     */
    right(amount=1) {
      return this.relativeWalk('right', amount, { x: amount, y: 0 });
    },

    /**
     * Move object one space upwards.
     */
    up(amount=1) {
      return this.relativeWalk('up', amount, { x: 0, y: amount * -1 });
    },

    /**
     * Move object one space downwards.
     */
    down(amount=1) {
      return this.relativeWalk('down', amount, { x: 0, y: amount });
    },

    /**
     * Grab an object.
     */
    grab(value) {
      this.say({
        text: `I'm grabbing the ${value}...`,
        type: 'dialogue'
      });
      return this.grab(value);
    },

    /**
     * Drop an object.
     */
    drop(value) {
      this.say({
        text: `I'm dropping the ${value}...`,
        type: 'dialogue'
      });
      return this.drop(value);
    },

    /**
     * Go to an object.
     */
    async goto(value) {
      this.say({
        text: `I'm going to the [[${value}]]...`,
        type: 'dialogue'
      });

      const obj = this.world.getObject(value);
      if (obj)
        await this.walk(obj.position);
    },

    /**
     * Speak a message over the object's head.
     */
    speak(text) {
      if (typeof text != 'string')
        text = JSON.stringify(text);

      this.say({ type: 'overhead', text });
    }
  }
}
