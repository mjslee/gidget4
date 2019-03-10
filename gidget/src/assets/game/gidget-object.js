import Objects from './objects/_import'


export default {
	// Parents
	engine: undefined,
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
	position: [0, 0],
	layer: 0,


	/*
	 * Create object in world
	 */
	create() {
		// Only set ID if it's a new object and not a grabbed/dropped one
		if (this.id === -1)
			this.id = ++this.engine.recentID;

		// Call created callback
		if (this.engine && typeof this.engine.objectCreated === 'function')
			this.engine.objectCreated(this);

		// Give a name if not set
		if (this.name === undefined)
			this.name = this.type

		// Merge user-defined object with generic object
		Object.assign(this, Objects[this.type]);
	},


	/*
	 * Move object in world.
	 */
	move(x, y) {
		// Get next tile and check for blocking object
		if (this.engine.objects.find((obj) =>
			obj.position[0] === x && obj.position[1] === x && obj.blocking))
			return false;

		let success = true;

		// Individually set these so references won't be destroyed
			this.position[0] = x;
			this.position[1] = y;

		// Detect object collisions
		this.engine.objects.filter((obj) =>
			obj.position[0] === this.position[0] &&
			obj.position[1] === this.position[1] &&
			obj.id !== this.id
		).forEach((obj) => {
			if (obj.methods && typeof obj.methods.collision === 'function')
				// Return false when the collision method returns false
				success = obj.methods.collision.call(obj, this) !== false;
		});

		// Call move callback
		if (this.engine && typeof this.engine.objectMoved === 'function')
			this.engine.objectMoved(this);

		return success;
	},


	/*
	 * Get point path array between two points.
	 */
	path(x, y) {
		// Virtual positions
		let nextX = this.position[0];
		let nextY = this.position[1];

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


	walk(x, y, intervalMilliseconds) {
		const that = this;
		const path = this.path(x, y);

		// Nowhere to move!
		if (path.length < 1)
			return false;

		// Move immediately to circumvent setInterval's initial delay
		that.move(path[0][0], path[0][1]);

		// If we only needed to move once, then finish
		if (path.length === 1)
			return true;

		// Move one tile every given milliseconds
		let i = 1, interval = setInterval(() => {
			that.move(path[i][0], path[i][1]);
			if (++i >= path.length)
				clearInterval(interval);
		}, intervalMilliseconds);
	},


	/*
	 * Grab object on world.
	 */
	grab(name) {
		let obj = this.engine.objects.find((findObj) => 
			findObj.position[0] === this.position[0] &&
			findObj.position[1] === this.position[1] &&
			findObj.name === name);

		// Delete object from world
		obj.delete();
		
		// Add object to grabbed array
		this.grabbed.push(obj);
	},


	/*
	 * Drop object from player's grabbed objects.
	 */
	drop(name) {
		// Find index of item
		let index = this.grabbed.findIndex((findObj) =>
			findObj.name === name);

		// Save object before deleting it
		let obj = this.grabbed[index];
		obj.position = this.position;

		// Delete from `grabbed` array
		this.grabbed.splice(index, 1);

		// Add to world objects array
		this.engine.objects.push(obj);

		// Call drop callback
		if (this.engine && typeof this.engine.objectDropped === 'function')
			this.engine.objectDropped(obj);
	},


	/*
	 * Delete object from world.
	 */
	delete() {
		// Find index of item
		let index = this.engine.objects.findIndex((findObj) =>
			findObj.id === this.id);

		// Delete from engine's objects
		this.engine.objects.splice(index, 1);

		// Call delete callback
		if (this.engine && typeof this.engine.objectDeleted === 'function')
			this.engine.objectDeleted(this);
	}
};
