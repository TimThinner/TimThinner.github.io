import Controller from '../common/Controller.js';

import { HPAC101Model, HPAC105Model } from  './HPACModels.js';

import DistrictAEWrapperView from './DistrictAEWrapperView.js';
/*
		HPAC				2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today
								2 coloured values in same chart:
101								HPAC (JK_101)
105								HPAC (JK_102)
*/
export default class DistrictAEController extends Controller {
	
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
			if (key === 'HPAC101Model' || key === 'HPAC105Model') {
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	init() {
		const model_101 = new HPAC101Model({name:'HPAC101Model',src:'data/arina/iss/feeds.json?meterId=101'});
		model_101.subscribe(this);
		this.master.modelRepo.add('HPAC101Model',model_101);
		this.models['HPAC101Model'] = model_101;
		
		const model_105 = new HPAC105Model({name:'HPAC105Model',src:'data/arina/iss/feeds.json?meterId=105'});
		model_105.subscribe(this);
		this.master.modelRepo.add('HPAC105Model',model_105);
		this.models['HPAC105Model'] = model_105;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictAEWrapperView(this);
	}
}
