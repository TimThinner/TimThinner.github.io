import Controller from '../common/Controller.js';
import BuildingEmissionFactorForElectricityConsumedInFinlandModel from  './BuildingEmissionFactorForElectricityConsumedInFinlandModel.js';
import BuildingEmissionFactorOfElectricityProductionInFinlandModel from './BuildingEmissionFactorOfElectricityProductionInFinlandModel.js';
import CView from './CView.js';

export default class CController extends Controller {
	
	constructor(options) {
		super(options);
		this.fetching_interval_in_seconds = 60;
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='BuildingEmissionFactorForElectricityConsumedInFinlandModel' ||
				key==='BuildingEmissionFactorOfElectricityProductionInFinlandModel') {
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
		const BEFFECIFM = new BuildingEmissionFactorForElectricityConsumedInFinlandModel({
			name:'BuildingEmissionFactorForElectricityConsumedInFinlandModel',
			
			src:'/obixStore/store/Fingrid/emissionFactorForElectricityConsumedInFinland/',
			interval: 'PT3M', // interval MUST BE defined for ROLLUP API
			
			cache_expiration_in_seconds:120,
			timerange: { begin: 1, end: 0 },
			access:'PUBLIC'
		});
		BEFFECIFM.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add('BuildingEmissionFactorForElectricityConsumedInFinlandModel',BEFFECIFM);
		this.models['BuildingEmissionFactorForElectricityConsumedInFinlandModel'] = BEFFECIFM;
		
		const BEFOEPIFM = new BuildingEmissionFactorOfElectricityProductionInFinlandModel({
			name:'BuildingEmissionFactorOfElectricityProductionInFinlandModel',
			
			src:'/obixStore/store/Fingrid/emissionFactorOfElectricityProductionInFinland/',
			interval: 'PT3M', // interval MUST BE defined for ROLLUP API
			
			cache_expiration_in_seconds:120,
			timerange: { begin: 1, end: 0 },
			access:'PUBLIC'
		});
		BEFOEPIFM.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add('BuildingEmissionFactorOfElectricityProductionInFinlandModel',BEFOEPIFM);
		this.models['BuildingEmissionFactorOfElectricityProductionInFinlandModel'] = BEFOEPIFM;
		
		
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
			models:[
				'BuildingEmissionFactorForElectricityConsumedInFinlandModel',
				'BuildingEmissionFactorOfElectricityProductionInFinlandModel'
			]
		};
	}
}
