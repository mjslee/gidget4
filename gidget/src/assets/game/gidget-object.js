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
	position: [0, 0],
	layer: 0,


	/**
	 * Create object in world.
	 *
	 */
	create(id) {
		// Give object a name if not already set
		if (this.name === undefined && this.type !== undefined)
			this.name = this.type;

		this.id = id;
	},


	/*
	 * Move object in world.
	 */
	move(x, y) {
		// Get next tile and check for blocking object
		if (this.world.getBlockingObjectAt(x, y))
			return false;

		// Individually set these so references won't be destroyed
		this.position[0] = x;
		this.position[1] = y;

		// Detect object collisions
		this.world.detectCollision(this);

		// Call without 'x' and 'y' arguments so only the callback is ran
		this.world.moveObject(this);

		return true;
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


	/*
	 * Grab object on world.
	 */
	grab(name) {
		let obj = this.world.objects.find((findObj) => 
			findObj.position[0] === this.position[0] &&
			findObj.position[1] === this.position[1] &&
			findObj.name === name);

		// Remove object from world
		obj.remove();
		
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

		// Remove from `grabbed` array
		this.grabbed.splice(index, 1);

		// Add object back to world
		this.world.addObject(obj);
	},


	/*
	 * Remove object from world.
	 */
	remove() {
		this.world.removeObject(this);
	}
};
