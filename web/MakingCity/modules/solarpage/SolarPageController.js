import Controller from '../common/Controller.js';
import SolarPageView from './SolarPageView.js';
import { FingridSolarPowerFinlandModel } from  '../fingrid/FingridModels.js';

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
		Object.keys(this.models).forEach(key => {
			if (key === 'FingridSolarPowerFinlandModel') {
				this.master.modelRepo.remove(key);
			}
		});
		
	}
	
	init() {
		/*
		NOTE: In SOLAR FORECAST case we are giving here just a base src address, it will be appended with start_time and end_time, like this:
		https://api.fingrid.fi/v1/variable/248/events/json?start_time=2021-05-14T15:00:00Z&end_time=2021-05-16T15:00:00Z
		*/
		const m = new FingridSolarPowerFinlandModel({name:'FingridSolarPowerFinlandModel',src:'https://api.fingrid.fi/v1/variable/248/events/json?'});
		m.subscribe(this);
		this.master.modelRepo.add('FingridSolarPowerFinlandModel',m);
		this.models['FingridSolarPowerFinlandModel'] = m;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.timers['SolarPageChartView'] = {timer: undefined, interval: 3600000, models:['FingridSolarPowerFinlandModel']};
		
		this.view = new SolarPageView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
