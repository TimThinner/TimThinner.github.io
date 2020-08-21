import EventObserver from '../common/EventObserver.js';

export default class InfluxModel extends EventObserver {
	
	constructor() {
		super();
		this.data = [];
	}
	
	reset() {
		this.data = [];
	}
}
