import Controller from '../common/Controller.js';
import StatusModel from  './StatusModel.js';
import DistrictAView from './DistrictAView.js';

export default class DistrictAController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
	}
	
	init() {
		const model = new StatusModel({name:'StatusModel',src:'data/arina/iss/status'});
		model.subscribe(this);
		this.master.modelRepo.add('StatusModel',model);
		this.models['StatusModel'] = model;
		
		setTimeout(() => { model.fetch(); }, 100);
		
		this.timers['DistrictAView'] = {timer: undefined, interval: 30000, models:['StatusModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictAView(this);
		this.show();
	}
}
