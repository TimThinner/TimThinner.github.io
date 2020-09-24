
import Model from '../common/Model.js';

export default class MenuModel extends Model {
	
	constructor(options) {
		super(options);
		this.ready = true; // Always true!
		this.selected = undefined;
	}
	
	setSelected(sel) {
		console.log (['setSelected=',sel]);
		this.selected = sel;
		setTimeout(() => this.notifyAll({model:'MenuModel',method:'selected',status:200,message:'',selected:this.selected}), 100);
	}
}
