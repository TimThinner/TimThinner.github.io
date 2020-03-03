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
		this.menuModel = undefined;
	}
	
	remove() {
		super.remove();
		if (this.menuModel) {
			this.menuModel.unsubscribe(this);
		}
	}
	
	init() {
		const model_109 = new Other109Model({name:'Other109Model',src:'data/arina/iss/feeds.json?meterId=109'});
		model_109.subscribe(this);
		//model_109.subscribe(this.master);
		this.master.modelRepo.add('Other109Model',model_109);
		this.models['Other109Model'] = model_109;
		//model_109.fetch();
		
		const model_111 = new Other111Model({name:'Other111Model',src:'data/arina/iss/feeds.json?meterId=111'});
		model_111.subscribe(this);
		//model_111.subscribe(this.master);
		this.master.modelRepo.add('Other111Model',model_111);
		this.models['Other111Model'] = model_111;
		//model_111.fetch();
		
		setTimeout(() => { model_109.fetch(); }, 1300);
		setTimeout(() => { model_111.fetch(); }, 1400);
		
		this.timers['OtherChartView'] = {timer: undefined, interval: 30000, models:['Other109Model','Other111Model']};
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		this.view = new DistrictAFWrapperView(this);
		this.show();
	}
}
