export default {
	// Parents
	engine: undefined,
	grabber: undefined,

	// Object Data
	id: -1,
	name: undefined,
	image: undefined,

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
	},


	/*
	 * Move object in world.
	 */
	move(x, y) {
		if (x !== undefined)
			this.position = [x, y];

		// Call move callback
		if (this.engine && typeof this.engine.objectMoved === 'function')
			this.engine.objectMoved(this);
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
