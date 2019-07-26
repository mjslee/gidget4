import GidgetObject from './gidget-object'



export default {
  nextId: 0,
  size: 3,
  objects: [],
  messages: [],
  hooks: [],

  // Callbacks
  // TODO: Remove all unnecessary callbacks
  //onObjectAdded(obj) { console.log(obj, 'An object was added!') }
  //onObjectMoved(obj) { console.log(obj, 'An object was moved!') }
  //onObjectRemoved(obj) { console.log(obj, 'An object was removed!') }
  //onObjectSay(messages) { console.log(messages, 'An object said something!') }


  /**
   * Creates a new GidgetWorld instance.
   *
   * @param {dictionary} kwargs Default properties.
   */
  create(attrs) {
    const self = _.cloneDeep(this)
    Object.assign(self, attrs)
    return self
  },


  /**
   * Creates a restorable world state object.
   *
   * @return {object} A world state object
   */
  getState() {
    // Create an object to restore important world properties
    const state = {
      // Primitives
      nextId: this.nextId,
      size: this.size,

      // Arrays / Objects
      objects: [],
      messages: this.messages,
      hooks: this.hooks
    };

    // TODO: Use a map function instead of this loop
    // Save objects
    for (let i = 0, len = this.objects.length; i < len; i++)
      state.objects.push(this.getObjectState(this.objects[i]));

    // Deep clone the state to accidental prevent mutation
    return _.cloneDeep(state)
  },


  /**
   * Restores the world state using a world state object.
   * State can be retrieved using the 'getState' method.
   *
   * @param {object} state - A world state object.
   * @return {boolean} Success of restoration.
   */
  restoreState(state) {
    // Ensure the passed state value is an object
    if (typeof state != 'object')
      return false

    // Restore messages and hooks
    this.messages = state.messages
    this.hooks = state.hooks

    // Restore properties of primitive types (number, string, boolean)
    for (let prop in state) {
      const type = typeof state[prop]
      if (type == 'number' || type == 'string' || type == 'boolean')
        this[prop] = state[prop]
    }

    // Restore game objects
    for (let i = 0, len = state.objects.length; i < len; i++)
      this.restoreObjectState(state.objects[i])

    return true
  },


  /**
   * Creates a restorable game object state object.
   * WARNING: Result is not cloned; mutations WILL affect the game object.
   *
   * @param {object} gameObject - A game object.
   * @return {object} A game object state object.
   */
  getObjectState(gameObject) {
    // Create state object to store the game objects state
    const objectState = {}

    // Copy values of primitive properties to the state object
    for (let prop in gameObject) {
      const type = typeof gameObject[prop]

      if (type != 'object' && type != 'function')
        objectState[prop] = gameObject[prop]
    }

    // Position should be the only object that needs to be saved
    objectState.position = gameObject.position
    return objectState
  },


  /**
   * Restores a game object to a state using a game object state object.
   *
   * @param {object} objectState - A game object state object.
   * @return {boolean} Success of game object restoration.
   */
  restoreObjectState(objectState) {
    // Get the object to restore by using the state
    const gameObject = this.getObject(objectState)

    // If an object doesn't exist, we'll need to re-create it. An object may
    // not exist because it was removed from the world or is grabbed by another
    // object.
    if (typeof gameObject != 'object')
      return this.createObject(objectState)

    // Loop over each property in the objectState
    for (let prop in gameObject) {
      const type = typeof gameObject[prop]

      if (type != 'object' && type != 'function')
        gameObject[prop] = objectState[prop]
    }

    // Update position's x and y individually to keep the variable reference
    // TODO: Find out if this is still necessary with the new engine
    gameObject.position.x = objectState.position.x
    gameObject.position.y = objectState.position.y
  },


  /**
   * Gets a map object of all the world's game objects.
   * Objects with the same name will be grouped into an array.
   *
   * @return {object} Map object of game objects.
   */
  getObjects() {
    // TODO: Clean this function up, it's very confusing to read
    const objectsMap = {}

    this.objects.forEach(obj => {
      // Create object in results if it doesn't already exist
      if (typeof objectsMap[obj.name] == 'undefined')
        objectsMap[obj.name] = obj

      // Multiple objects of the same name already exist, add new object
      // to the array
      else if (Array.isArray(objectsMap[obj.name])) {
        objectsMap[obj.name].push(obj)
        obj.arrayIndex = objectsMap[obj.name].length - 1
      }

      // Object of the same name already exists, turn it into an array so they
      // can be grouped together
      else {
        let prevObj = objectsMap[obj.name]
        objectsMap[obj.name] = [prevObj, obj]
        prevObj.arrayIndex = 0
        obj.arrayIndex = 1
      }
    })

    return objectsMap
  },


  /**
   * Gets a cloned map object of game objects without functions and without
   * objects that will cause a circular loop.
   *
   * @return {object} Map object of game objects.
   */
  getObjectsSanitized() {
    // TODO: Find a more native solution. Maybe using 'getObjectState'?
    return _.cloneDeep(
      _.omit(_.omitBy(this.getObjects(), _.isFunction), ['world', 'object'])
    )
  },


  /**
   * Gets a game object based on specified conditions.
   *
   * @param {object|number|string|function} conditions - An object identifier.
   * @return {object} A game object.
   */
  getObject(gameObject, conditions) {
    let comparison
    switch (typeof gameObject) {
      // passed in is an object, compare its 'id' against gameObject 'id'
      case 'object':
        comparison = (obj) => obj.id === gameObject.id
        break

      // compare against 'id'
      case 'number':
        comparison = (obj) => obj.id === gameObject
        break

      // compare against 'name'
      case 'string':
        comparison = (obj) => obj.name === gameObject
        break

      // some other type
      case 'function':
        comparison = gameObject
        break
    }

    // Attempt to find object
    const foundObject = this.objects.find(obj => (
      (typeof comparison == 'function' ? comparison(obj) : true) &&
      (typeof conditions == 'function' ? conditions(obj) : true)
    ))

    // foundObject will be undefined if nothing is found
    if (typeof foundObject == 'undefined')
      return

    // Call onGet from the game object
    if (typeof foundObject.onGet == 'function')
      foundObject.onGet().call(foundObject)

    return foundObject
  },


  /**
   * Creates a game object in the world. 'type' attribute in kwargs is required.
   * For example: kwargs={type: 'Gidget'}
   *
   * @param {object} kwargs Attributes to assign to object on creation.
   * @return {boolean} Success of creating object.
   */
  createObject(attrs) {
    // Create the object and add it to the world
    const gameObject = GidgetObject.create(this, this.nextId++, attrs)
     return this.addObject(gameObject)
  },


  /**
   * Adds a game object to world.
   *
   * @param {object} gameObject - A game object.
   * @return {boolean} Success of adding object.
   */
  addObject(gameObject) {
    if (typeof gameObject != 'object')
      return false

    this.objects.push(gameObject)

    // Call callback
    if (typeof this.onObjectAdded === 'function')
      this.onObjectAdded(this)

    return true
  },


  /**
   * Removes an object from the world by its id.
   *
   * @param {object} obj Object to remove.
   * @return {boolean} Success of removal.
   */
  removeObject(id) {
    // TODO: Change this to remove by the object and not by the id
    // Find objects index by its ID
    let index = this.objects.findIndex(obj => obj.id === id)
    if (index < 0)
      return false

    // Remove from world's objects
    this.objects.splice(index, 1);

    // Call callback
    if (typeof this.onObjectRemoved === 'function')
      this.onObjectRemoved(this);

    delete this;
    return true;
  },


  /*
   * Move object to another tile's position.
   * Using 'obj.move({ x, y })' is the preferred way to move objects.
   *
   * @param {object} obj Object that was moved.
   * @return {boolean}
   */
  moveObject(gameObject, position) {
    let result = false

    //
    if (typeof position == 'object')
      result = gameObject.move(position);

    // Call callback
    if (result && typeof this.onObjectMoved == 'function')
      this.onObjectMoved(gameObject)

    return result
  },


  /**
   * Detect an object collision based on position. Run 'onCollision' for each
   * collided object.
   *
   * @param {object} obj Object to detect collisions for.
   * @return {void}
   */
  getCollisions(obj) {
    this.objects.filter((obj2) =>
      obj.id !== obj2.id &&
      this.insideObjectBoundaries(obj, obj2.position)
    ).forEach((obj2) => {
      let maybePromise = undefined;

      // Collision callback to first object
      if (typeof obj.onCollision === 'function')
        maybePromise = obj.onCollision.call(obj, obj2);

      // Check if obj.onCollision returned a promise, and if so then we'll
      // call the second objects onCollision callback after the promise
      // is resolved (from using 'then')
      if (maybePromise && typeof maybePromise.then === 'function')
        maybePromise.then(() => {
          if (typeof obj2.onCollision === 'function')
            obj2.onCollision.call(obj2, obj);
        });

      // Return was not a promise, so not waiting required
      else if (typeof obj2.onCollision === 'function')
        obj2.onCollision.call(obj2, obj);
    });
  },


  /**
   * Get an object's boundaries.
   * (There's probably a more efficient way to do this)
   *
   * @param {object} obj -- Object to get boundaries for.
   * @return {object}
   */
  getObjectBoundaries(obj) {
    const fromX = Math.floor(obj.position.x - ((obj.scale / 2) - 1));
    return {
      fromX: fromX,
      fromY: obj.position.y - Math.floor(obj.scale - 1),
      toX: obj.position.x + (obj.position.x - fromX),
      toY: obj.position.y
    }
  },


  /**
   * Determine if x and y are inside an object's boundaries.
   *
   * @param {object} obj
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  insideObjectBoundaries(obj, position) {
    // Do not scale boundaries up with object's 'scale' property
    if (!obj.scaleBoundaries)
      return obj.position.x == position.x && obj.position.y == position.y;

    // Scale boundaries up with object scale
    // Less efficient than above, so use this only with scaleBoundaries
    const bounds = this.getObjectBoundaries(obj);
    return (
      position.x >= bounds.fromX && position.x <= bounds.toX &&
      position.y >= bounds.fromY && position.y <= bounds.toY
    );
  },


  /**
   * Get point path array between two points.
   *
   * @param {number} fromX
   * @param {number} fromY
   * @param {number} toX
   * @param {number} toY
   * @return {array}
   */
  getPath(fromPosition, toPosition) {
    const result = [];
    const newPosition = _.clone(fromPosition);

    // Get differences of current position and desired position
    let diffX = toPosition.x - newPosition.x;
    let diffY = toPosition.y - newPosition.y;

    // Get differences to zero to be at desired position
    while (diffX != 0 || diffY != 0) {
      if (diffX > 0) {
        diffX--;
        result.push({ x: ++newPosition.x, y: newPosition.y });
      }
      else if (diffX < 0) {
        diffX++;
        result.push({ x: --newPosition.x, y: newPosition.y });
      }

      if (diffY > 0) {
        diffY--;
        result.push({ x: newPosition.x, y: ++newPosition.y });
      }
      else if (diffY < 0) {
        diffY++;
        result.push({ x: newPosition.x, y: --newPosition.y });
      }
    }

    return result;
  },



  /**
   * Determine if position is valid.
   * Checks tile position exists.
   * Checks for blocking objects.
   *
   * @param {function} conditions
   */
  validatePosition(position) {
    return (
      position.x >= 0 && position.x <= this.size - 1 &&
      position.y >= 0 && position.y <= this.size - 1
    ) && !this.getObject(
      obj => obj.blocking && this.insideObjectBoundaries(obj, position)
    )
  },


  /**
   * Call for each game tick.
   * Call each object's onTick method.
   *
   * @param {function} conditions
   */
  gameTick() {
    // Clear hooks, so they're not re-ran on the next tick
    this.hooks = []

    this.objects.forEach((object) => {
      // Update fake getter properties
      object.updateProps()

      // Call 'onTick' for each object that has it
      if (typeof object.onTick == 'function')
        object.onTick.call(object)
    })
  },


  /**
   * Run onObjectSay() callback to pass to a UI.
   *
   * @param {number} object -- Object to send to callback.
   * @param {number} messages -- Object array of messages.
   * @return {void}
   */
  say(message) {
    const lastElement = this.messages[this.messages.length - 1]

    if (lastElement && message.text === lastElement.text) {
      if (typeof lastElement.repeats != 'number')
        lastElement.repeats = 2
      else
        lastElement.repeats += 1
    }

    else {
      this.messages.push(message)
    }
  }
}
