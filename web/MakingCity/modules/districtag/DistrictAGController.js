import Controller from '../common/Controller.js';

import { Cooler113Model, Cooler112Model } from  './CoolerModels.js';

import DistrictAGWrapperView from './DistrictAGWrapperView.js';
/*
		Coolers & freezers	2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today
								2 coloured values in same chart:
113								Refrigerating machines
112								Refrigerating equipments
*/
export default class DistrictAGController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
	}
	
	refreshTimerange() {
		const timerName = 'CoolerChartView';
		super.doPollingInterval(timerName);
	}
	
	init() {
		const model_113 = new Cooler113Model({name:'Cooler113Model',src:'data/arina/iss/feeds.json?meterId=113'});
		model_113.subscribe(this);
		this.master.modelRepo.add('Cooler113Model',model_113);
		this.models['Cooler113Model'] = model_113;
		
		const model_112 = new Cooler112Model({name:'Cooler112Model',src:'data/arina/iss/feeds.json?meterId=112'});
		model_112.subscribe(this);
		this.master.modelRepo.add('Cooler112Model',model_112);
		this.models['Cooler112Model'] = model_112;
		
		setTimeout(() => { model_113.fetch(); }, 1500);
		setTimeout(() => { model_112.fetch(); }, 1600);
		
		this.timers['CoolerChartView'] = {timer: undefined, interval: 30000, models:['Cooler113Model','Cooler112Model']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictAGWrapperView(this);
		this.show();
	}
}
