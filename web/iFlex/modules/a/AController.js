import Controller from '../common/Controller.js';
import { BuildingElectricityPL1Model, BuildingElectricityPL2Model, BuildingElectricityPL3Model } from  './BuildingElectricityModels.js';
import AView from './AView.js';

//https://ba.vtt.fi/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L1/
//https://ba.vtt.fi/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L2/
//https://ba.vtt.fi/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L3/

export default class AController extends Controller {
	
	constructor(options) {
		super(options);
		this.fetching_interval_in_seconds = 60;
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='BuildingElectricityPL1Model' || key==='BuildingElectricityPL2Model' || key==='BuildingElectricityPL3Model') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	/*
	refreshTimerange() {
		this.restartPollingInterval('AView');
	}
	*/
	clean() {
		console.log('UserHeatingController is now REALLY cleaned!');
		this.remove();
		this.init();
	}
	
	init() {
		// NOTE: host: 'ba.vtt.fi' is added at the backend
		// We can select dynamically whether data fetcher uses "QUERY" or "ROLLUP" API:
		// "query/" or "rollup/" is added at ObixModel depending on if "interval" is defined or not.
		const BEPL1M = new BuildingElectricityPL1Model({
			name:'BuildingElectricityPL1Model',
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L1/', // Power of L1
			access:'PUBLIC'
		});
		BEPL1M.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add('BuildingElectricityPL1Model',BEPL1M);
		this.models['BuildingElectricityPL1Model'] = BEPL1M;
		
		const BEPL2M = new BuildingElectricityPL2Model({
			name:'BuildingElectricityPL2Model',
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L2/', // Power of L2
			access:'PUBLIC'
		});
		BEPL2M.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add('BuildingElectricityPL2Model',BEPL2M);
		this.models['BuildingElectricityPL2Model'] = BEPL2M;
		
		const BEPL3M = new BuildingElectricityPL3Model({
			name:'BuildingElectricityPL3Model',
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_WM40_P_L3/', // Power of L3
			access:'PUBLIC'
		});
		BEPL3M.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add('BuildingElectricityPL3Model',BEPL3M);
		this.models['BuildingElectricityPL3Model'] = BEPL3M;
		
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new AView(this);
	}
}
