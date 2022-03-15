import Controller from '../common/Controller.js';
import { BuildingHeatingQE01Model }  from  './BuildingHeatingModels.js';
import BView from './BView.js';

export default class BController extends Controller {
	
	constructor(options) {
		super(options);
		this.fetching_interval_in_seconds = 60;
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='BuildingHeatingQE01Model') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	/*
	refreshTimerange() {
		this.restartPollingInterval('BView');
	}
	*/
	//https://ba.vtt.fi/obixStore/store/VainoAuerinKatu13/FI_H_H160_DH_FE01/
	//https://ba.vtt.fi/obixStore/store/VainoAuerinKatu13/FI_H_H160_DH_QE01/
	
	// NOTE: host: 'ba.vtt.fi' is added at the backend
	
	
	clean() {
		console.log('UserHeatingController is now REALLY cleaned!');
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
		this.init();
	}
	
	init() {
		const model = new BuildingHeatingQE01Model({
			name:'BuildingHeatingQE01Model',
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_DH_QE01/',
			access:'PUBLIC'
		});
		model.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add('BuildingHeatingQE01Model',model);
		this.models['BuildingHeatingQE01Model'] = model;
		
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new BView(this);
	}
}
