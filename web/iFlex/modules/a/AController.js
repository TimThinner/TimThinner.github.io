import Controller from '../common/Controller.js';
import BuildingElectricityModel from  './BuildingElectricityModel.js';
import AView from './AView.js';

export default class AController extends Controller {
	
	constructor(options) {
		super(options);
		this.fetching_interval_in_seconds = 60;
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='BuildingElectricityModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	initialize() {
		
		const BEM = new BuildingElectricityModel({
			name:'BuildingElectricityModel',
			// https://ba.vtt.fi/obixStore/store/Fingrid/emissionFactorForElectricityConsumedInFinland/query/
			// https://ba.vtt.fi/obixStore/store/Fingrid/emissionFactorOfElectricityProductionInFinland/query/
			// https://ba.vtt.fi/obixStore/store/NuukaOpenData/1752%20Malmitalo/Electricity/query/
			// https://ba.vtt.fi/obixStore/store/NuukaOpenData/1752%20Malmitalo/Heat/query/
			
			// NOTE: host: 'ba.vtt.fi' is added at the backend
			src:'/obixStore/store/NuukaOpenData/1752%20Malmitalo/Electricity/query/',
			cache_expiration_in_seconds:60,
			timerange: { begin: 10, end: 2 },
			access:'PUBLIC'
		});
		
		BEM.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add('BuildingElectricityModel',BEM);
		this.models['BuildingElectricityModel'] = BEM;
		
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new AView(this);
	}
	
	clean() {
		console.log('UserHeatingController is now REALLY cleaned!');
		this.remove();
		this.initialize();
	}
	
	init() {
		this.initialize();
		const interval = this.fetching_interval_in_seconds * 1000; // once per 60 seconds by default.
		this.timers['AView'] = {timer:undefined, interval:interval, models:['BuildingElectricityModel']};
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
