import Controller from '../../common/Controller.js';
import UserApartmentModel from '../../userpage/UserApartmentModel.js';
import UWCWrapperView from './UWCWrapperView.js';

export default class UserWaterChartsController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='UserWaterALLModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	refreshTimerange() {
		const timerName = 'UserWaterChartsView';
		this.restartPollingInterval(timerName);
	}
	
	initialize() {
		const allTR = {ends:{value:10,unit:'seconds'},starts:{value:1,unit:'days'}};
		
		const model = new UserApartmentModel({name:'UserWaterALLModel',src:'data/sivakka/apartments/feeds.json',type:'water',limit:0,range:allTR});
		model.subscribe(this);
		this.master.modelRepo.add('UserWaterALLModel',model);
		this.models['UserWaterALLModel'] = model;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UWCWrapperView(this);
	}
	
	clean() {
		console.log('UserElectricityChartsController is now REALLY cleaned!');
		this.remove();
		this.initialize();
	}
	
	init() {
		this.initialize();
		this.timers['UserWaterChartsView'] = {timer: undefined, interval: 60000, models:['UserWaterALLModel']};
		this.show(); // Try if this view can be shown right now!
	}
}
