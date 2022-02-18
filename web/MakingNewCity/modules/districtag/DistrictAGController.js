import Controller from '../common/Controller.js';

import { Cooler113Model, Cooler112Model, Cooler117Model, CoolerKLPowerModel, CoolerCoolingPowerModel } from  './CoolerModels.js';

import DistrictAGWrapperView from './DistrictAGWrapperView.js';
/*
		Coolers & freezers	2 charts - 1. Power [kW] (linechart) 2. Energy [kWh] (columnchart) today
								2 coloured values in same chart:
113								Refrigerating machines
112								Refrigerating equipments


22.12.2020 New measurements 

VAK1_KL_POWER_FM, pointId=983, https://makingcity.vtt.fi/data/arina/jetitek/feeds.json?pointId=983&start=2020-12-22&end=2020-12-22&limit=10
VVAK1_CG_UNIT_CAP.Z_MT_COOLING_POWER_NET, pointId=1012, https://makingcity.vtt.fi/data/arina/jetitek/feeds.json?pointId=1012&start=2020-12-22&end=2020-12-22&limit=10


*/
export default class DistrictAGController extends Controller {
	
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
			if (key === 'Cooler113Model' || key === 'Cooler112Model' || key === 'Cooler117Model' || 'CoolerKLPowerModel'||'CoolerCoolingPowerModel') {
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	refreshTimerange() {
		const timerName = 'CoolerChartView';
		this.restartPollingInterval(timerName);
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
		
		const model_117 = new Cooler117Model({name:'Cooler117Model',src:'data/arina/iss/feeds.json?calc=1&meterId=117'});
		model_117.subscribe(this);
		this.master.modelRepo.add('Cooler117Model',model_117);
		this.models['Cooler117Model'] = model_117;
		
		const model_KL_power = new CoolerKLPowerModel({name:'CoolerKLPowerModel',src:'data/arina/jetitek/feeds.json?pointId=983'});
		model_KL_power.subscribe(this);
		this.master.modelRepo.add('CoolerKLPowerModel',model_KL_power);
		this.models['CoolerKLPowerModel'] = model_KL_power;
		
		const model_Cooling_Power = new CoolerCoolingPowerModel({name:'CoolerCoolingPowerModel',src:'data/arina/jetitek/feeds.json?pointId=1012'});
		model_Cooling_Power.subscribe(this);
		this.master.modelRepo.add('CoolerCoolingPowerModel',model_Cooling_Power);
		this.models['CoolerCoolingPowerModel'] = model_Cooling_Power;
		
		
		
		/*
		setTimeout(() => { model_113.fetch(); }, 1500);
		setTimeout(() => { model_112.fetch(); }, 1600);
		*/
		this.timers['CoolerChartView'] = {timer: undefined, interval: 30000, models:['Cooler113Model','Cooler112Model','Cooler117Model','CoolerKLPowerModel','CoolerCoolingPowerModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictAGWrapperView(this);
		this.show();
	}
}
