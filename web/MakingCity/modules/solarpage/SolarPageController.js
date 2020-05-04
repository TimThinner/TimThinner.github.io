import Controller from '../common/Controller.js';
import SolarPageModel from  './SolarPageModel.js';
import SolarPageView from './SolarPageView.js';

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
			if (key === 'SolarPageModel') {
				this.master.modelRepo.remove(key);
			}
		});
		
	}
	
	init() {
		const model = new SolarPageModel({name:'SolarPageModel',src:'to-be-added-in-the-future'});
		model.subscribe(this);
		this.master.modelRepo.add('SolarPageModel',model);
		this.models['SolarPageModel'] = model;
		
		this.timers['SolarPageChartView'] = {timer: undefined, interval: 30000, models:['SolarPageModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new SolarPageView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
