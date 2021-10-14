import Controller from '../common/Controller.js';
//import { BuildingHeatingFE01Model, BuildingHeatingQE01Model }  from  './BuildingHeatingModels.js';
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
			//if (key==='BuildingHeatingFE01Model' || key==='BuildingHeatingQE01Model') {
			if (key==='BuildingHeatingQE01Model') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	refreshTimerange() {
		this.restartPollingInterval('BView');
	}
	
	//https://ba.vtt.fi/obixStore/store/VainoAuerinKatu13/FI_H_H160_DH_FE01/
	//https://ba.vtt.fi/obixStore/store/VainoAuerinKatu13/FI_H_H160_DH_QE01/
	
	// NOTE: host: 'ba.vtt.fi' is added at the backend
	
	initialize() {
		/*
		const BHFE01M = new BuildingHeatingFE01Model({
			name:'BuildingHeatingFE01Model',
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_DH_FE01/',
			//interval: 'PT1H', // interval MUST BE defined for ROLLUP API
			cache_expiration_in_seconds:60,
			//timerange: { begin: 1, end: 0 },
			timerange: { begin:{value:1,unit:'days'},end:{value:0,unit:'days'}},
			access:'PUBLIC'
		});
		BHFE01M.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add('BuildingHeatingFE01Model',BHFE01M);
		this.models['BuildingHeatingFE01Model'] = BHFE01M;
		
		*/
		
		const BHQE01M = new BuildingHeatingQE01Model({
			name:'BuildingHeatingQE01Model',
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_DH_QE01/',
			//interval: 'PT1H', // interval MUST BE defined for ROLLUP API
			cache_expiration_in_seconds:60,
			//timerange: { begin: 1, end: 0 },
			timerange: { begin:{value:1,unit:'days'},end:{value:0,unit:'days'}},
			access:'PUBLIC'
		});
		BHQE01M.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add('BuildingHeatingQE01Model',BHQE01M);
		this.models['BuildingHeatingQE01Model'] = BHQE01M;
		
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new BView(this);
		
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
		this.initialize();
	}
	
	init() {
		this.initialize();
		const interval = this.fetching_interval_in_seconds * 1000; // once per 60 seconds by default.
		//this.timers['BView'] = {timer:undefined, interval:interval, models:['BuildingHeatingFE01Model','BuildingHeatingQE01Model']};
		this.timers['BView'] = {timer:undefined, interval:interval, models:['BuildingHeatingQE01Model']};
		
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
