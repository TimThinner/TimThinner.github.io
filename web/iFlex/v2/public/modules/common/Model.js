import EventObserver from './EventObserver.js';

export default class Model extends EventObserver {
	
	constructor(options) {
		super();
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.status = 500;
		this.fetching = false;
	}
	
	/* Dummy reset. */
	reset() {
		
	}
	
	/* Dummy fetch. */
	fetch() {
		console.log('DUMMY FETCH!');
		this.ready = true;
	}
}
