import Controller from '../common/Controller.js';
import DistrictAModel from  './DistrictAModel.js';
import DistrictAView from './DistrictAView.js';

export default class DistrictAController extends Controller {
	
	constructor(options) {
		super(options);
		this.menuModel = undefined;
	}
	
	remove() {
		super.remove();
		if (this.menuModel) {
			this.menuModel.unsubscribe(this);
		}
	}
	
	init() {
		const model = new DistrictAModel();
		model.subscribe(this);
		//model.subscribe(this.master);
		this.master.modelRepo.add('DistrictAModel',model);
		this.models['DistrictAModel'] = model;
		model.fetch();
		
		this.timers['DistrictAView'] = {timer: undefined, interval: 10000, models:['DistrictAModel']};
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		
		this.view = new DistrictAView(this);
		this.show();
	}
}
