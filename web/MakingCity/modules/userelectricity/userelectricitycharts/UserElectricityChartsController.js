import Controller from '../../common/Controller.js';
import UserApartmentModel from '../../userpage/UserApartmentModel.js';
//import UserElectricityChartsView from './UserElectricityChartsView.js';
//import UECWrapperView from './UECWrapperView.js';

import UECEnergyChartViewOnly from './UECEnergyChartViewOnly.js';

export default class UserElectricityChartsController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='UserElectricityALLModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	initialize() {
		
		
		// NOTE: ALL is now actually set to 7 days!
		// This must be maybe set up like in S-Market case where USER selects the timerange (from 1 to 7 days).
		// Now = now - 60 seconds! 
		const dayz = 7; // 7 x 24 = 168 hours
/*
How many values are there in power chart if interval is one minute?
How many values are there in energy chart if interval is one hour?
days         power       energy
 1            1440        24
 2            2880        48
 3            4320        72
 4            5760        96
 5            7200       120
 6            8640       144
 7           10080       168
14           20160       336
28           40320       672
*/
		
		// In energy-chart energy values are calculated from averagePower value given once a minute. 
		// So from timestamp the YYYYMMDDHH hash key is taken and values are added to form a sum and 
		// finally average is calculated for the hour.
		// 
		// NOTE: If power-chart is also displayed, it will have 168 x 60 values = 10 080 values to display!!!
		//
		//
		//
		const allTR = {ends:{value:60,unit:'seconds'},starts:{value:dayz,unit:'days'}};
		
		const model = new UserApartmentModel({name:'UserElectricityALLModel',src:'data/sivakka/apartments/feeds.json',type:'energy',limit:0,dayz:dayz,timerange:allTR});
		model.subscribe(this);
		this.master.modelRepo.add('UserElectricityALLModel',model);
		this.models['UserElectricityALLModel'] = model;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		//this.view = new UserElectricityChartsView(this);
		
		//this.view = new UECWrapperView(this);
		
		this.view = new UECEnergyChartViewOnly(this);
	}
	
	clean() {
		console.log('UserElectricityChartsController is now REALLY cleaned!');
		this.remove();
		/* IN PeriodicPoller:
		Object.keys(this.timers).forEach(key => {
			if (this.timers[key].timer) {
				clearTimeout(this.timers[key].timer);
				this.timers[key].timer = undefined;
			}
		});
		*/
		/* IN Controller:
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		*/
		// AND in this.remove finally all models created here is removed.
		// So we need to do init() almost in its entirety again ... timers are NOT deleted in remove, 
		// so there is no need to redefine them.
		this.initialize();
	}
	
	init() {
		this.initialize();
		this.timers['UserElectricityChartsView'] = {timer: undefined, interval: 60000, models:['UserElectricityALLModel']};
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
