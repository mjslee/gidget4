const GidgetGame = {
	engine: GidgetEngine,
	worldSize: 4,
	worldElement: null,

	/*
	 * Setup engine and callbacks.
	 */
	setupEngine() {
		this.engine.objectCreated = this.objectCreated.bind(this);
		this.engine.objectDeleted = this.objectDeleted.bind(this);
		this.engine.objectDropped = this.objectCreated.bind(this);
		this.engine.objectMoved = this.objectMoved.bind(this);
	},

	/*
	 * Callback: Create object element and place on world.
	 */
	objectCreated(obj) {
		let el = document.createElement("div"); 
		el.className = `object object-${obj.id} ${obj.class}`;
		this.worldElement.appendChild(el);

		// Move object to correct position
		this.objectMoved(obj);
	},

	/*
	 * Callback: Visually move object to tile within the world.
	 */
	objectMoved(obj) {
		let tile = this.worldElement.querySelector(
			`.row-${obj.position[0]} .column-${obj.position[1]}`
		);
		let el = this.worldElement.querySelector(`.object-${obj.id}`);

		el.style.top = `${tile.offsetTop}px`;
		el.style.left = `${tile.offsetLeft}px`;
	},

	/*
	 * Callback: Remove element from DOM.
	 */
	objectDeleted(obj) {
		let el = this.worldElement.querySelector(`.object-${obj.id}`);
		console.log(el);
		el.remove();
	},

	/*
	 * Create game world with elements: {worldSize}x{worldSize}
	 * Probably replace with a canvas library for performance.
	 */
	createWorld() {
		// Create rows
		for (let i = 0; i < this.worldSize; i++) {
			let row = document.createElement("div"); 
			row.className = `tile row row-${i}`;

			// Create columns
			for (let j = 0; j < this.worldSize; j++) {
				let column = document.createElement("div"); 
				column.className = `tile column column-${j}`;
				row.appendChild(column);
			}

			this.worldElement.appendChild(row);
		}
	},

	/*
	 * Initialize Gidget Game
	 */
	initialize(worldElement) {
		this.worldElement = worldElement;
		this.setupEngine();
		this.createWorld();
		return this;
	}
};
