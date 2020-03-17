import Controller from '../common/Controller.js';

import { Kitchen106Model, Kitchen107Model, Kitchen108Model } from  './KitchenModels.js';

import DistrictADWrapperView from './DistrictADWrapperView.js';
/*
		Kitchen appliances	2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today
								3 coloured values in same chart:
106								R3 Owen
107								R4 Owen
108								Dishwasher
*/
export default class DistrictADController extends Controller {
	
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
			if (key === 'Kitchen106Model' || key === 'Kitchen107Model' || key === 'Kitchen108Model') {
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	refreshTimerange() {
		const timerName = 'KitchenChartView';
		super.doPollingInterval(timerName);
	}
	
	init() {
		const model_106 = new Kitchen106Model({name:'Kitchen106Model',src:'data/arina/iss/feeds.json?meterId=106'});
		model_106.subscribe(this);
		this.master.modelRepo.add('Kitchen106Model',model_106);
		this.models['Kitchen106Model'] = model_106;
		
		const model_107 = new Kitchen107Model({name:'Kitchen107Model',src:'data/arina/iss/feeds.json?meterId=107'});
		model_107.subscribe(this);
		this.master.modelRepo.add('Kitchen107Model',model_107);
		this.models['Kitchen107Model'] = model_107;
		
		const model_108 = new Kitchen108Model({name:'Kitchen108Model',src:'data/arina/iss/feeds.json?meterId=108'});
		model_108.subscribe(this);
		this.master.modelRepo.add('Kitchen108Model',model_108);
		this.models['Kitchen108Model'] = model_108;
		/*
		setTimeout(() => { model_106.fetch(); }, 800);
		setTimeout(() => { model_107.fetch(); }, 900);
		setTimeout(() => { model_108.fetch(); }, 1000);
		*/
		this.timers['KitchenChartView'] = {timer: undefined, interval: 30000, models:['Kitchen106Model','Kitchen107Model','Kitchen108Model']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictADWrapperView(this);
		this.show();
	}
}
