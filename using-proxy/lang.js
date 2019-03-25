const Gidget = {
	move(...args) {
		console.log('Display this');
	}
};



const ProxyGidget = {
	move(x, y) {
		Gidget.move(x, y);
	}
};


const Runner = {
	run() {
		// Cannot access this, window, or document
		const window = undefined;
		const document = undefined;
		eval('ProxyGidget.move(25, 30); console.log(this, window, document);');
	}
}

Runner.run()
