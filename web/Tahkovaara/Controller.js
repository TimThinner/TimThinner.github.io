import View from './View.js';

class Controller {
	
	constructor() {
		this.view = undefined;
	}
	
	init() {
		this.view = new View();
		this.view.show();
	}
}
new Controller().init();
