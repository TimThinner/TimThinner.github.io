import Controller from '../common/Controller.js';
import BuildingEmissionFactorForElectricityConsumedInFinlandModel from  './BuildingEmissionFactorForElectricityConsumedInFinlandModel.js';
import { BuildingElectricityPL1Model, BuildingElectricityPL2Model, BuildingElectricityPL3Model } from  '../a/BuildingElectricityModels.js';
import { BuildingHeatingQE01Model }  from  '../b/BuildingHeatingModels.js';
import CView from './CView.js';

export default class CController extends Controller {
	
	constructor(options) {
		super(options);
		this.fetching_interval_in_seconds = 60;
		
		// These are the models that are created in this Controller.
		this.modelnames = [
			'BuildingEmissionFactorForElectricityConsumedInFinlandModel',
			'CControllerBuildingElectricityPL1Model',
			'CControllerBuildingElectricityPL2Model',
			'CControllerBuildingElectricityPL3Model',
			'CControllerBuildingHeatingQE01Model'
		];
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (this.modelnames.includes(key)) {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
/*
PT30S (30 seconds)
PT5M (5 minutes)
PT1H (1 hour)
PT24H (24 hours)

INTERVAL	TIMERANGE		NUMBER OF SAMPLES
1 MIN		1 day (24H)		1440 (24 x 60)
10 MINS		1 week			1008 (7 x 24 x 6)
30 MINS 	1 month			1440 (30 x 48)
4 HOURS		6 months		1080 (30 x 6 x 6)
6 HOURS		1 year			1460 (4 x 365)
*/
	initialize() {
		const model_1 = new BuildingEmissionFactorForElectricityConsumedInFinlandModel({
			name: this.modelnames[0],
			src:'/obixStore/store/Fingrid/emissionFactorForElectricityConsumedInFinland/',
			access:'PUBLIC'
		});
		model_1.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add(this.modelnames[0], model_1);
		this.models[this.modelnames[0]] = model_1;
		
		// NOTE: do not use same model instances created in A or B controller. 
		// Create new instances here:
		
		
		// NOTE: host: 'ba.vtt.fi' is added at the backend
		// We can select dynamically whether data fetcher uses "QUERY" or "ROLLUP" API:
		// "query/" or "rollup/" is added at ObixModel depending on if "interval" is defined or not.
		const model_2 = new BuildingElectricityPL1Model({
			name: this.modelnames[1],
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L1/', // Power of L1
			access:'PUBLIC'
		});
		model_2.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add(this.modelnames[1], model_2);
		this.models[this.modelnames[1]] = model_2;
		
		const model_3 = new BuildingElectricityPL2Model({
			name: this.modelnames[2],
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L2/', // Power of L2
			access:'PUBLIC'
		});
		model_3.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add(this.modelnames[2], model_3);
		this.models[this.modelnames[2]] = model_3;
		
		const model_4 = new BuildingElectricityPL3Model({
			name: this.modelnames[3],
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L3/', // Power of L3
			access:'PUBLIC'
		});
		model_4.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add(this.modelnames[3], model_4);
		this.models[this.modelnames[3]] = model_4;
		
		const model_5 = new BuildingHeatingQE01Model({
			name: this.modelnames[4],
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_DH_QE01/',
			access:'PUBLIC'
		});
		model_5.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add(this.modelnames[4], model_5);
		this.models[this.modelnames[4]] = model_5;
		
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new CView(this);
		
		// At init() there is ALWAYS only one controller with visible=true, this controller.
		// and also the ResizeEventObserver is started at init() => this controller is shown 
		// TWICE in init() if this.show() is called here!!!
		
		//this.startPollers();
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		
		//this.show(); // Try if this view can be shown right now!
		/*
			NOTE: this.show() calls this.view.show(); and 
			this.startPollers(); but there are no timers defined, so no polling is actually performed.
		*/
	}
	
	refreshTimerange() {
		this.restartPollingInterval('CView');
	}
	
	clean() {
		console.log('CController is now REALLY cleaned!');
		this.remove();
		/* IN PeriodicPoller:
		Object.keys(this.timers).forEach(key => {
			if (this.timers[key].timer) {
				clearTimeout(this.timers[key].timer);
				this.timers[key].timer = undefined;
			}
		});
		*/
		/* IN Controller:
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		*/
		// AND in this.remove finally all models created here is removed.
		// So we need to do init() almost in its entirety again ... timers are NOT deleted in remove, 
		// so there is no need to redefine them.
		this.initialize();
	}
	init() {
		
		this.initialize();
		const interval = this.fetching_interval_in_seconds * 1000; // once per 60 seconds by default.
		this.timers['CView'] = {
			timer:undefined,
			interval:interval,
			models: this.modelnames
		};
	}
}
