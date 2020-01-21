
import EventObserver from '../common/EventObserver.js';

export default class MenuModel extends EventObserver {
	constructor() {
		super();
		this.src = undefined;
		this.ready = false;
		this.errorMessage = '';
		this.data = '';
		this.selected = undefined;
	}
	
	fetch() {
		this.src = 'foobar';
		const url = this.backend + '/' + this.src;
		console.log (['fetch url=',url]);
		// Simulate small delay => fetch OK.
		
		
		this.ready = true;
		this.data = 'MODEL DATA';
		
		//this.errorMessage = 'Fetch failed !!!';
		//setTimeout(() => this.notifyAll({model:'MenuModel',method:'fetched',status:400,message:'Fetch failed !!!'}), 100);
		setTimeout(() => this.notifyAll({model:'MenuModel',method:'fetched',status:200,message:''}), 100);
		
	}
	
	setSelected(sel) {
		console.log (['setSelected=',sel]);
		this.selected = sel;
		setTimeout(() => this.notifyAll({model:'MenuModel',method:'selected',status:200,message:'',selected:this.selected}), 100);
	}
}
