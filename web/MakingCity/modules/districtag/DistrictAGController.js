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
		this.menuModel = undefined;
	}
	
	remove() {
		super.remove();
		if (this.menuModel) {
			this.menuModel.unsubscribe(this);
		}
	}
	
	init() {
		const model_113 = new Cooler113Model({name:'Cooler113Model',src:'data/arina/iss/feeds.json?meterId=113'});
		model_113.subscribe(this);
		//model_113.subscribe(this.master);
		this.master.modelRepo.add('Cooler113Model',model_113);
		this.models['Cooler113Model'] = model_113;
		//model_113.fetch();
		
		const model_112 = new Cooler112Model({name:'Cooler112Model',src:'data/arina/iss/feeds.json?meterId=112'});
		model_112.subscribe(this);
		//model_112.subscribe(this.master);
		this.master.modelRepo.add('Cooler112Model',model_112);
		this.models['Cooler112Model'] = model_112;
		//model_112.fetch();
		
		setTimeout(() => { model_113.fetch(); }, 1500);
		setTimeout(() => { model_112.fetch(); }, 1600);
		
		this.timers['CoolerChartView'] = {timer: undefined, interval: 30000, models:['Cooler113Model','Cooler112Model']};
		
		this.menuModel = this.master.modelRepo.get('MenuModel');
		if (this.menuModel) {
			this.menuModel.subscribe(this);
		}
		this.view = new DistrictAGWrapperView(this);
		this.show();
	}
}
