let a;
let b;
const getLines = (lines) => {
	lines.forEach((line, index) => {
		lines[index] = addYield(line);
	});

	lines.unshift('function* probablyUnsafe() {');
	lines.push('}; i = probablyUnsafe();');

	console.log(lines);
	b = lines;
	a = eval(lines.join(' '));
};


const addYield = (line) => {
	return "yield {};" + line;
};


const evaluateCode = (code) => {
	getLines(code.split('\n'));
};
