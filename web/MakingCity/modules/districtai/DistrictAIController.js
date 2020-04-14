import Controller from '../common/Controller.js';
import GeothermalModel from  './GeothermalModel.js';
import DistrictAIWrapperView from './DistrictAIWrapperView.js';

export default class DistrictAIController extends Controller {
	
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
			if (key === 'GeothermalModel') {
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	refreshTimerange() {
		const timerName = 'GeothermalChartView';
		this.restartPollingInterval(timerName);
	}
	
	init() {
		const model = new GeothermalModel({name:'GeothermalModel',src:'data/arina/iss/feeds.json?calc=1&meterId=115'});
		model.subscribe(this);
		this.master.modelRepo.add('GeothermalModel',model);
		this.models['GeothermalModel'] = model;
		/*
		setTimeout(() => { model.fetch(); }, 1700);
		*/
		this.timers['GeothermalChartView'] = {timer: undefined, interval: 30000, models:['GeothermalModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictAIWrapperView(this);
		this.show();
	}
}
