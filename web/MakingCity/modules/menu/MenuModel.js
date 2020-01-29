
import EventObserver from '../common/EventObserver.js';

export default class MenuModel extends EventObserver {
	constructor() {
		super();
		this.src = undefined;
		this.ready = false;
		this.errorMessage = '';
		this.fetching = false;
		
		this.data = '';
		this.selected = undefined;
	}
	
	fetch() {
		if (this.fetching===true) {
			console.log('FETCHING ALREADY IN PROCESS!');
			return;
		}
		this.fetching = true;
		this.src = 'menu';
		const url = this.backend + '/' + this.src;
		console.log (['fetch url=',url]);
		// ..and in the fetch ... then or catch parts of code we set this to false...
		setTimeout(() => {
			this.fetching = false;
			this.ready = true;
			this.data = 'MODEL DATA';
			this.notifyAll({model:'MenuModel',method:'fetched',status:200,message:'OK'});
		}, 200);
	}
	
	setSelected(sel) {
		console.log (['setSelected=',sel]);
		this.selected = sel;
		setTimeout(() => this.notifyAll({model:'MenuModel',method:'selected',status:200,message:'',selected:this.selected}), 100);
	}
}
