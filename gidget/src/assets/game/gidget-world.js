import GidgetObject from './gidget-object'
import GidgetObjects from './objects/_import'



export default {

  // World Data
  size: 4,

  // Object Data
  player: undefined,
  objects: [],
  nextID: -1,

  // Callbacks
  onObjectAdded(obj) { console.log(obj, 'An object was added!') },
  onObjectMoved(obj) { console.log(obj, 'An object was moved!') },
  onObjectRemoved(obj) { console.log(obj, 'An object was removed!') },


  /**
   * Determine if position is valid.
   * + Check that tile position exists.
   * + Check for blocking objects.
   * @param {function} conditions
   */
  isPositionValid(x, y) {
    return (x >= 0 && x <= this.size && y >= 0 && y <= this.size) &&
      !this.getObject((obj) => 
        obj.blocking &&
        obj.position.x === x &&
        obj.position.y === y)
  },


  /**
   * Find object based on specified conditions.
   * @param {function} conditions
   */
  getObject(conditions) {
    return this.objects.find(conditions);
  },


  /**
   * Find object based on its position.
   * @param {number} x
   * @param {number} y
   */
  getObjectAt(x, y) {
    return this.getObject((obj) => 
      obj.position.x === x &&
      obj.position.y === y);
  },


  /**
   * Detect an object collision based on position. Run 'onCollision' for each
   * collided object.
   * @param {object} obj Object to detect collisions for.
   */
  detectCollision(obj) {
    this.objects.filter((obj2) =>
      obj.id !== obj2.id &&
      obj.position.x === obj2.position.x &&
      obj.position.y === obj2.position.y
    ).forEach((obj2) => {
      // 
      if (typeof obj.onCollision === 'function')
        obj.onCollision.call(obj, obj2) !== false;

      if (typeof obj2.onCollision === 'function')
        obj2.onCollision.call(obj2, obj) !== false;
    });
  },


  /**
   * Create object in world. 'type' attribute in kwargs is required.
   * For example: kwargs={type: 'Gidget'}
   * @param {object} kwargs Attributes to assign to object on creation.
   */
  createObject(kwargs) {
    // Copy object into another variable
    let obj = Object.assign({}, GidgetObject);
    obj.world = this;

    // Merge the types overrides (like attributes in Gidget.js)
    // and merge kwargs into the new object
    Object.assign(obj, GidgetObjects[kwargs.type]);
    Object.assign(obj, kwargs);

    // Create the object and add it to the world
    obj.create(++this.nextID);
    this.addObject(obj);

    return obj;
  },


  /**
   * Create player object in world.
   * @param {object} kwargs Attributes to assign to object on creation.
   */
  createPlayer(kwargs) {
    this.player = this.createObject(kwargs);
  },


  /**
   * Add object to world. Use 'createObject' to create a new object.
   * @params {object} obj Object to add.
   */
  addObject(obj) {
    this.objects.push(obj);

    // Call callback
    if (typeof this.onObjectAdded === 'function')
      this.onObjectAdded(this);
  },


  /**
   * Remove object from world.
   * @params {object} obj Object to remove.
   */
  removeObject(obj) {
    let index = this.objects.findIndex((findObj) => findObj.id === obj.id);

    // Remove from world's objects
    this.objects.splice(index, 1);

    // Call callback
    if (typeof this.onObjectRemoved === 'function')
      this.onObjectRemoved(this);

    delete this;
  },


  /*
   * Move object to another tile's position.
   * Using 'obj.move(x, y)' is the preferred way to move objects.
   * @params {object} obj Object that was moved.
   */
  moveObject(obj, x, y) {
    if (x !== undefined || y !== undefined) {
      obj.move(x, y);
    }

    // Call callback
    if (typeof this.onObjectMoved === 'function')
      this.onObjectMoved(this);
  }

}
