const JSWalker = {
	steps: [],

	traverse(node, callback, parentNode=undefined) {
		if (node === undefined || node === null)
			return;

		const traverse = node => {
			if (typeof callback === 'function')
				callback.call(this, node, parentNode);

			this.traverse(node.body, callback, node);
			this.traverse(node.consequent, callback, node);
			this.traverse(node.alternate, callback, node);
		};

		if (!Array.isArray(node))
			traverse(node);
		else
			for (let i = 0, len = node.length; i < len; i++)
				traverse(node[i]);
	},


	toTree(input) {
		return esprima.parseScript(input, { range: true });
	},



	run(input) {
		//const originalInput = input;
		const ast = this.toTree(input);

		const insertAt = (text, input, position) =>
			text.substr(0, position + input.length) + input + input.substr(position);
		
		let textModifications = [];
		this.traverse([ast], (node, nodeParent) => {
			console.log(node.type, nodeParent ? nodeParent.type : '');
			// textModifications.push({ type: node.type, position: node.range[0], start: true });
			// textModifications.push({ type: node.type, position: node.range[1], end: true });
		});

		textModifications.sort((a, b) => b.position - a.position).forEach((action) => {
			input = input.substr(0, action.position) + "{" + action.type + "}" + input.substr(action.position);
		});

		// console.log(input);

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
