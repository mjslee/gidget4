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
		
		let actions = [];
		this.traverseBodies([ast], node => {
			actions.push({ type: node.type, position: node.range[0], start: true });
			actions.push({ type: node.type, position: node.range[1], end: true });
		});
		actions = actions.sort((a, b) => b.position - a.position);
		console.log(actions);

		let b = "X";
		actions.forEach((action) => {
			input = input.substr(0, action.position) + b + input.substr(action.position);
		});

		console.log(input);

		// window.input=input;
		// console.log(input);

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
