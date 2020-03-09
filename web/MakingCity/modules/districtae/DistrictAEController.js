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
	}
	
	refreshTimerange() {
		const timerName = 'HPACChartView';
		super.doPollingInterval(timerName);
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
		
		setTimeout(() => { model_101.fetch(); }, 1100);
		setTimeout(() => { model_105.fetch(); }, 1200);
		
		this.timers['HPACChartView'] = {timer: undefined, interval: 30000, models:['HPAC101Model','HPAC105Model']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictAEWrapperView(this);
		this.show();
	}
}
