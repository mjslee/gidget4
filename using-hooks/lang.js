const CodeWalker = {

	lineOrder: [],
	steps: [],

	startLine(number) {
		//this.lineOrder.push(number);
	},


	endLine(number) {
		this.lineOrder.push(number);
	},


	inject(number, input) {
		const call = '.call(__,' + number + ')'
		return '__startLine' + call + ';' + input + ';__endLine' + call + '\n';
	},


	evaluate(input) {
		const lines = input.split('\n');

		let result = '';
		for (let i = 0, len = lines.length; i < len; i++)
			result += this.inject(i, lines[i]);

		this.inputCode = input;
		console.log(result);
		
		(() => {
			const __ = this;
			const __startLine = this.startLine;
			const __endLine = this.endLine;
			eval(result);
		}).call();
	}

};
