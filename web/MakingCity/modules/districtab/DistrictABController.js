import Controller from '../common/Controller.js';
import SolarModel from  './SolarModel.js';
import DistrictABWrapperView from './DistrictABWrapperView.js';

export default class DistrictABController extends Controller {
	
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
			if (key === 'SolarModel') {
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	refreshTimerange() {
		const timerName = 'SolarChartView';
		super.doPollingInterval(timerName);
	}
	
	init() {
		const model = new SolarModel({name:'SolarModel',src:'data/arina/iss/feeds.json?meterId=116'});
		model.subscribe(this);
		this.master.modelRepo.add('SolarModel',model);
		this.models['SolarModel'] = model;
		/*
		setTimeout(() => { model.fetch(); }, 300);
		*/
		this.timers['SolarChartView'] = {timer: undefined, interval: 30000, models:['SolarModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictABWrapperView(this);
		this.show();
	}
}
