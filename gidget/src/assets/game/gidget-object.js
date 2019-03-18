export default {
  // Parents
  world: undefined,
  grabber: undefined,

  // Object Data
  id: -1,
  type: undefined,
  name: undefined,
  image: undefined,

  blocking: false,

  // World Data
  energy: 100,
  grabbed: [],
  position: { x: 0, y: 0 },
  layer: 0,


  /**
   * Create object in world.
   * @param {number} id Unique identification number.
   */
  create(id) {
    // Give object a name if not already set
    if (this.name === undefined && this.type !== undefined)
      this.name = this.type;

    this.id = id;
  },


  /**
   * Move object to position in world.
   * @param {number} x
   * @param {number} y
   */
  move(x, y) {
    // Validate new position
    if (!this.world.isPositionValid(x, y))
      return false;

    // Get next tile and check for blocking object
    if (this.world.getBlockingObjectAt(x, y))
      return false;

    // Individually set these so references won't be destroyed
    this.position.x = x;
    this.position.y = y;

    // Detect object collisions
    this.world.detectCollision(this);

    // Call without 'x' and 'y' arguments so only the callback is ran
    this.world.moveObject(this);

    return true;
  },


  /**
   * Get point path array between two points.
   * @param {number} x
   * @param {number} y
   */
  path(x, y) {
    // Virtual positions
    let nextX = this.position.x;
    let nextY = this.position.y;

    // Get differences of current position and desired position
    let diffX = x - nextX;
    let diffY = y - nextY;

    const result = [];

    // Get differences to zero to be at desired position
    while (diffX != 0 || diffY != 0) {
      if (diffX > 0) {
        diffX--;
        result.push([++nextX, nextY]);
      }
      else if (diffX < 0) {
        diffX++;
        result.push([--nextX, nextY]);
      }

      if (diffY > 0) {
        diffY--;
        result.push([nextX, ++nextY]);
      }
      else if (diffY < 0) {
        diffY++;
        result.push([nextX, --nextY]);
      }
    }

    return result;
  },


  /**
   * Walk object to a position.
   * @param {number} x
   * @param {number} y
   */
  walk(x, y, intervalMilliseconds=150) {
    const path = this.path(x, y);

    // Nowhere to move!
    if (path.length < 1)
      return false;

    // Move immediately to circumvent setInterval's initial delay
    if (!this.move(...path[0]))
      return false;

    // If we only needed to move once, then finish
    if (path.length === 1)
      return true;

    // Move one tile every given milliseconds
    let i = 1, interval = setInterval(() => {
      if (!this.move(...path[i]) || ++i >= path.length)
        clearInterval(interval);
    }, intervalMilliseconds);
  },


  /**
   * Grab object into this object's grabbed array.
   * @param {name} Object name to grab.
   */
  grab(name) {
    let obj = this.world.objects.find((obj) => 
      obj.name === name &&
      obj.position.x === this.position.x &&
      obj.position.y === this.position.y);

    // Remove object from world
    obj.remove();

    // Add object to grabbed array
    this.grabbed.push(obj);
    obj.grabber = this;
  },


  /**
   * Drop object from this object's grabbed array.
   * @param {string/Object} Object name to drop.
   */
  drop(name_or_obj) {
    // Find index of item
    let index = this.grabbed.findIndex((obj) => obj.name === name);

    // Save object before deleting it
    let obj = this.grabbed[index];
    obj.position = this.position;

    // Remove from `grabbed` array
    this.grabbed.splice(index, 1);

    // Add object back to world
    this.world.addObject(obj);
  },


  /*
   * Drop 
   */
  dropSelf() {

  },


  /**
   * Remove this object from the world.
   */
  remove() {
    this.world.removeObject(this);
  }
};
