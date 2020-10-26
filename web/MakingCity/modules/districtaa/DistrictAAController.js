import Controller from '../common/Controller.js';
import TotalModel from  './TotalModel.js';
import DistrictAAWrapperView from './DistrictAAWrapperView.js';

export default class DistrictAAController extends Controller {
	
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
			if (key === 'TotalModel') {
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	refreshTimerange() {
		const timerName = 'TotalChartView';
		this.restartPollingInterval(timerName);
	}
	
	init() {
		const model = new TotalModel({name:'TotalModel',src:'data/arina/iss/feeds.json?meterId=114'});
		model.subscribe(this);
		this.master.modelRepo.add('TotalModel',model);
		this.models['TotalModel'] = model;
		
		this.timers['TotalChartView'] = {timer: undefined, interval: 30000, models:['TotalModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictAAWrapperView(this);
		this.show();
	}
}
