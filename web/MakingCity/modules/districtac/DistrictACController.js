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
		this.menuModel = undefined;
	}
	
	remove() {
		super.remove();
		if (this.menuModel) {
			this.menuModel.unsubscribe(this);
		}
	}
	
	init() {
		const model_102 = new Light102Model({name:'Light102Model',src:'data/arina/iss/feeds.json?meterId=102&limit=1440'});
		model_102.subscribe(this);
		//model_102.subscribe(this.master);
		this.master.modelRepo.add('Light102Model',model_102);
		this.models['Light102Model'] = model_102;
		model_102.fetch();
		
		const model_103 = new Light103Model({name:'Light103Model',src:'data/arina/iss/feeds.json?meterId=103&limit=1440'});
		model_103.subscribe(this);
		this.master.modelRepo.add('Light103Model',model_103);
		this.models['Light103Model'] = model_103;
		model_103.fetch();
		
		const model_104 = new Light104Model({name:'Light104Model',src:'data/arina/iss/feeds.json?meterId=104&limit=1440'});
		model_104.subscribe(this);
		this.master.modelRepo.add('Light104Model',model_104);
		this.models['Light104Model'] = model_104;
		model_104.fetch();
		
		const model_110 = new Light110Model({name:'Light110Model',src:'data/arina/iss/feeds.json?meterId=110&limit=1440'});
		model_110.subscribe(this);
		this.master.modelRepo.add('Light110Model',model_110);
		this.models['Light110Model'] = model_110;
		model_110.fetch();
		
		
		this.timers['LightChartView'] = {timer: undefined, interval: 30000, models:['Light102Model','Light103Model','Light104Model','Light110Model']};
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		this.view = new DistrictACWrapperView(this);
		this.show();
	}
}
