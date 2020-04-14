import Controller from '../common/Controller.js';

import { Light102Model, Light103Model, Light104Model, Light110Model } from  './LightModels.js';

import DistrictACWrapperView from './DistrictACWrapperView.js';
/*
		Lights & appliances	2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today
								4 coloured values in same chart:
103								Indoor lighting (JK_101)
102								Outdoor lighting (JK_101)
110								Indoor lighting (JK_102)
104								Common spaces (JK_101)
*/
export default class DistrictACController extends Controller {
	
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
			if (key === 'Light102Model' || key === 'Light103Model' || key === 'Light104Model' || key === 'Light110Model') {
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	refreshTimerange() {
		const timerName = 'LightChartView';
		this.restartPollingInterval(timerName);
	}
	
	init() {
		const model_102 = new Light102Model({name:'Light102Model',src:'data/arina/iss/feeds.json?meterId=102'});
		model_102.subscribe(this);
		this.master.modelRepo.add('Light102Model',model_102);
		this.models['Light102Model'] = model_102;
		
		const model_103 = new Light103Model({name:'Light103Model',src:'data/arina/iss/feeds.json?meterId=103'});
		model_103.subscribe(this);
		this.master.modelRepo.add('Light103Model',model_103);
		this.models['Light103Model'] = model_103;
		
		const model_104 = new Light104Model({name:'Light104Model',src:'data/arina/iss/feeds.json?meterId=104'});
		model_104.subscribe(this);
		this.master.modelRepo.add('Light104Model',model_104);
		this.models['Light104Model'] = model_104;
		
		const model_110 = new Light110Model({name:'Light110Model',src:'data/arina/iss/feeds.json?meterId=110'});
		model_110.subscribe(this);
		this.master.modelRepo.add('Light110Model',model_110);
		this.models['Light110Model'] = model_110;
		/*
		setTimeout(() => { model_102.fetch(); }, 400);
		setTimeout(() => { model_103.fetch(); }, 500);
		setTimeout(() => { model_104.fetch(); }, 600);
		setTimeout(() => { model_110.fetch(); }, 700);
		*/
		this.timers['LightChartView'] = {timer: undefined, interval: 30000, models:['Light102Model','Light103Model','Light104Model','Light110Model']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictACWrapperView(this);
		this.show();
	}
}
