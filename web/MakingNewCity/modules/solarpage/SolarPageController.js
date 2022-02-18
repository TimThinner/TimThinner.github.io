import Controller from '../common/Controller.js';
import SolarPageView from './SolarPageView.js';
import FingridModel from  '../energydata/FingridModel.js';

export default class SolarPageController extends Controller {
	
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
		
		const model_names = ['FingridSolarPowerFinlandModel'];
		Object.keys(this.models).forEach(key => {
			if (model_names.includes(key)) {
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	init() {
		/*
		NOTE: In SOLAR FORECAST case we are giving here just a base src address, it will be appended with start_time and end_time, like this:
		https://api.fingrid.fi/v1/variable/248/events/json?start_time=2021-05-14T15:00:00Z&end_time=2021-05-16T15:00:00Z
		*/
		const m = new FingridModel({name:'FingridSolarPowerFinlandModel',src:'https://api.fingrid.fi/v1/variable/248/events/json?'});
		m.subscribe(this);
		this.master.modelRepo.add('FingridSolarPowerFinlandModel',m);
		this.models['FingridSolarPowerFinlandModel'] = m;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new SolarPageView(this);
	}
}
