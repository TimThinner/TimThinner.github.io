import EventObserver from './EventObserver.js';

export default class Model extends EventObserver {
	
	constructor() {
		super();
		this.src = undefined;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
	}
}
