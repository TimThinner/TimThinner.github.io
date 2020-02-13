
import Model from '../common/Model.js';

export default class MenuModel extends Model {
	constructor(options) {
		super(options);
		this.selected = undefined;
	}
	
	fetch() {
		if (this.fetching===true) {
			console.log('MENU FETCHING ALREADY IN PROCESS!');
			return;
		}
		this.fetching = true;
		//this.src = 'menu';
		const url = this.backend + '/' + this.src;
		console.log (['fetch url=',url]);
		// ..and in the fetch ... then or catch parts of code we set this to false...
		setTimeout(() => {
			this.fetching = false;
			this.ready = true;
			this.notifyAll({model:'MenuModel',method:'fetched',status:200,message:'OK'});
		}, 100);
	}
	
	setSelected(sel) {
		console.log (['setSelected=',sel]);
		this.selected = sel;
		setTimeout(() => this.notifyAll({model:'MenuModel',method:'selected',status:200,message:'',selected:this.selected}), 100);
	}
}
