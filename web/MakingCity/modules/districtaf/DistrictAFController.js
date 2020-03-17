import Controller from '../common/Controller.js';

import { Other109Model, Other111Model } from  './OtherModels.js';

import DistrictAFWrapperView from './DistrictAFWrapperView.js';
/*
		Other				2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today
								2 coloured values in same chart:
109								Car heating
111								VSS lighting
*/
export default class DistrictAFController extends Controller {
	
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
			if (key === 'Other109Model' || key === 'Other111Model') {
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	refreshTimerange() {
		const timerName = 'OtherChartView';
		super.doPollingInterval(timerName);
	}
	
	init() {
		const model_109 = new Other109Model({name:'Other109Model',src:'data/arina/iss/feeds.json?meterId=109'});
		model_109.subscribe(this);
		this.master.modelRepo.add('Other109Model',model_109);
		this.models['Other109Model'] = model_109;
		
		const model_111 = new Other111Model({name:'Other111Model',src:'data/arina/iss/feeds.json?meterId=111'});
		model_111.subscribe(this);
		this.master.modelRepo.add('Other111Model',model_111);
		this.models['Other111Model'] = model_111;
		/*
		setTimeout(() => { model_109.fetch(); }, 1300);
		setTimeout(() => { model_111.fetch(); }, 1400);
		*/
		this.timers['OtherChartView'] = {timer: undefined, interval: 30000, models:['Other109Model','Other111Model']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictAFWrapperView(this);
		this.show();
	}
}
