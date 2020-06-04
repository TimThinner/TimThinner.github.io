
import EventObserver from '../common/EventObserver.js';

export default class CameraModel extends EventObserver {
	
	constructor(options) {
		super();
		this.name = options.name;
		this.src = options.src;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
		this.fetchCount = 0;
	}
	
	fetch() {
		if (this.fetching) {
			console.log('MODEL '+this.name+' FETCHING ALREADY IN PROCESS!');
			return;
		}
		const status = 200; // OK.
		this.errorMessage = '';
		this.fetching = true;
		
		console.log ('CameraModel => fetch()...');
		
		setTimeout(() => {
			this.fetchCount++;
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:this.name, method:'fetched', status:status, message:'OK'});
		}, 100);
	}
}
