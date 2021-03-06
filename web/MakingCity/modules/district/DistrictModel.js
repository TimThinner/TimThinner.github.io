
import Model from '../common/Model.js';

export default class DistrictModel extends Model {
	
	constructor(options) {
		super(options);
		this.selected = undefined;
	}
	
	setSelected(sel) {
		console.log (['setSelected=',sel]);
		this.selected = sel;
		setTimeout(() => this.notifyAll({model:'DistrictModel',method:'selected',status:200,message:'',selected:this.selected}), 100);
	}
}
