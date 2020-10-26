import Controller from '../common/Controller.js';
import StatusModel from  './StatusModel.js';
import DistrictAView from './DistrictAView.js';

export default class DistrictAController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the init():
		// Currently this app does NOT remove Controllers. 
		// They are all created at the load and stay that way, so init() is called ONLY once.
		// BUT this is not how dynamic system should optimally behave.
		// So I just add model removal here, to enable this in the future.
		Object.keys(this.models).forEach(key => {
			if (key === 'StatusModel') {
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	init() {
		const model = new StatusModel({name:'StatusModel',src:'data/arina/iss/status'});
		model.subscribe(this);
		this.master.modelRepo.add('StatusModel',model);
		this.models['StatusModel'] = model;
		
		this.timers['DistrictAView'] = {timer: undefined, interval: 30000, models:['StatusModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictAView(this);
		this.show();
	}
}
