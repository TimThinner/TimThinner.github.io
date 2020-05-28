
import EventObserver from '../common/EventObserver.js';

export default class HomeModel extends EventObserver {
	
	constructor(options) {
		super();
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
	}
	
	fetch() {
		const self = this;
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		
		let status = 500; // error: 500
		this.errorMessage = '';
		this.fetching = true;
		
		console.log ('HomeModel => fetch()...');
		status = 200; // OK
		setTimeout(() => {
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:this.name, method:'fetched', status:status, message:'OK'});
		}, 200);
	}
}
