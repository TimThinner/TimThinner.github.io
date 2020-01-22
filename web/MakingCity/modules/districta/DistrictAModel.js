
import EventObserver from '../common/EventObserver.js';

export default class DistrictAModel extends EventObserver {
	
	constructor() {
		super();
		this.ready = false;
		this.errorMessage = '';
	}
	
	fetch() {
		this.ready = true;
		//setTimeout(() => this.notifyAll({model:'DistrictAModel',method:'fetched',status:200,message:'OK'}), 100);
		
		//this.errorMessage = 'OH OHOHO';
		//setTimeout(() => this.notifyAll({model:'DistrictAModel',method:'fetched',status:400,message:'OH OH!'}), 100);
		setTimeout(() => this.notifyAll({model:'DistrictAModel',method:'fetched',status:200,message:'OK'}), 100);
	}
}
