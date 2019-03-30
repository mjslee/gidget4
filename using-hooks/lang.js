const JSWalker = {
	steps: [],

	traverseBodies(nodes, callback) {
		let that = this;
		nodes.forEach((node) => {
			if (typeof callback === 'function')
				callback.call(this, node);

			if (typeof node.body === 'undefined')
				return;

			else if (typeof node.body.forEach === 'function')
				that.traverseBodies(node.body, callback);

			else if (typeof node.body.body.forEach === 'function')
				that.traverseBodies(node.body.body, callback);
		});
	},


	toTree(input) {
		return esprima.parseScript(input, { range: true });
	},



	run(input) {
		//const originalInput = input;
		const ast = this.toTree(input);
		
		const actions = [];
		this.traverseBodies([ast], node => {
			bodies.push(node);
		});

		// window.input=input;
		// console.log(input);

		// input = input.substr(0, node.range[0]) + b + input.substr(node.range[0]);

		/*let result = '';
		for (let i = 0, len = lines.length; i < len; i++)
			result += this.inject(i, lines[i]);

		this.inputCode = input;
		console.log(result);

		(() => {
			const window = undefined;
			const document = undefined;

			const __this = this;
			const __startLine = this.startLine;
			const __endLine = this.endLine;

			eval(result);
		}).call();
		*/
	}

};
