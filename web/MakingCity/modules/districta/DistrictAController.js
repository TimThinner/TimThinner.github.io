import Controller from '../common/Controller.js';
import StatusModel from  './StatusModel.js';
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
		const model = new StatusModel();
		model.subscribe(this);
		//model.subscribe(this.master);
		this.master.modelRepo.add('StatusModel',model);
		this.models['StatusModel'] = model;
		model.fetch();
		
		this.timers['DistrictAView'] = {timer: undefined, interval: 30000, models:['StatusModel']};
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		
		this.view = new DistrictAView(this);
		this.show();
	}
}
