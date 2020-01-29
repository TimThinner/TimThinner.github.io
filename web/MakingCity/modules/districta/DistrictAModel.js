
import EventObserver from '../common/EventObserver.js';

export default class DistrictAModel extends EventObserver {
	
	constructor() {
		super();
		this.src = undefined;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
	}
	
	fetch() {
		if (this.fetching) {
			console.log('FETCHING ALREADY IN PROCESS!');
			return;
		}
		this.fetching = true;
		this.src = 'DA-model';
		const url = this.backend + '/' + this.src;
		console.log (['fetch url=',url]);
		
		// ..and in the fetch ... then or catch parts of code we set this to false...
		setTimeout(() => {
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:'DistrictAModel',method:'fetched',status:200,message:'OK'});
		}, 200);
	}
}
