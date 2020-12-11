import Controller from '../../common/Controller.js';
import UserApartmentModel from '../../userpage/UserApartmentModel.js';
import UHCWrapperView from './UHCWrapperView.js';

export default class UserHeatingChartsController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='UserHeatingALLModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	refreshTimerange() {
		const timerName = 'UserHeatingChartsView';
		this.restartPollingInterval(timerName);
	}
	
	
	initialize() {
		const allTR = {ends:{value:10,unit:'seconds'},starts:{value:1,unit:'days'}};
		
		const model = new UserApartmentModel({name:'UserHeatingALLModel',src:'data/sivakka/apartments/feeds.json',type:'sensor',limit:0,range:allTR});
		model.subscribe(this);
		this.master.modelRepo.add('UserHeatingALLModel',model);
		this.models['UserHeatingALLModel'] = model;
		
		this.models['UserHeatingMonthModel'] = this.master.modelRepo.get('UserHeatingMonthModel');
		this.models['UserHeatingMonthModel'].subscribe(this);
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UHCWrapperView(this);
	}
	
	clean() {
		console.log('UserHeatingChartsController is now REALLY cleaned!');
		this.remove();
		this.initialize();
	}
	
	init() {
		this.initialize();
		this.timers['UserHeatingChartsView'] = {timer: undefined, interval: 60000, models:['UserHeatingALLModel']}; //'UserHeatingMonthModel']};
		this.show(); // Try if this view can be shown right now!
	}
}
