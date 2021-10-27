import Controller from '../common/Controller.js';
import { UserTemperatureModel, UserHumidityModel, UserCO2Model } from  './UserHeatingModels.js';
import UserHeatingView from './UserHeatingView.js';

export default class UserHeatingController extends Controller {
	
	constructor(options) {
		super(options);
		this.fetching_interval_in_seconds = 60;
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='UserTemperatureModel' || key==='UserHumidityModel' || key === 'UserCO2Model') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	refreshTimerange() {
		this.restartPollingInterval('UserHeatingView');
	}
	
	/*
		FI_H_H160_PV1_ME13/', Humidity A 1st floor
		FI_H_H160_PV1_ME14/', Humidity A 4th floor
		FI_H_H160_PV1_ME15/', Humidity C 1st floor
		FI_H_H160_PV1_ME16/', Humidity C 4th floor
		
		FI_H_H160_PV1_TE13/', Temperature A 1st floor
		FI_H_H160_PV1_TE14/', Temperature A 4th floor
		FI_H_H160_PV1_TE15/', Temperature C 1st floor
		FI_H_H160_PV1_TE16/', Temperature C 4th floor
		
		FI_H_H160_PV1_QE13	Room air co2 A 1st floor
		FI_H_H160_PV1_QE14	Room air co2 A 4th floor
		FI_H_H160_PV1_QE15	Room air co2 C 1st floor
		FI_H_H160_PV1_QE16	Room air co2 C 4th floor
	*/
	
	initialize() {
		
		/*
			When we create a UserHeatingModel, we want to add some additional parameters,
			for example how long cache keeps the data (cache expiration in seconds) and 
			the fetching interval (also in seconds).
		*/
		
		const UM = this.master.modelRepo.get('UserModel');
		console.log(['UM.obix_code=',UM.obix_code]);
		
		
		const UTM = new UserTemperatureModel({
			name:'UserTemperatureModel',
			// NOTE: host: 'ba.vtt.fi' is added at the backend
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_PV1_TE', // add obix_code + '/' at fetch phase (ObixModel).
			//interval: 'PT15M', // interval MUST BE defined for ROLLUP API
			//cache_expiration_in_seconds:60,
			//timerange: { begin:{value:1,unit:'days'},end:{value:0,unit:'days'}},
			access:'PRIVATE'
		});
		UTM.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add('UserTemperatureModel',UTM);
		this.models['UserTemperatureModel'] = UTM;
		
		const UHM = new UserHumidityModel({
			name:'UserHumidityModel',
			// NOTE: host: 'ba.vtt.fi' is added at the backend
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_PV1_ME', // add obix_code + '/' at fetch phase (ObixModel).
			//interval: 'PT15M', // interval MUST BE defined for ROLLUP API
			//cache_expiration_in_seconds:60,
			//timerange: { begin:{value:1,unit:'days'},end:{value:0,unit:'days'}},
			access:'PRIVATE'
		});
		UHM.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add('UserHumidityModel',UHM);
		this.models['UserHumidityModel'] = UHM;
		
		const UCO2M = new UserCO2Model({
			name:'UserCO2Model',
			// NOTE: host: 'ba.vtt.fi' is added at the backend
			src:'/obixStore/store/VainoAuerinKatu13/FI_H_H160_PV1_QE', // add obix_code + '/' at fetch phase (ObixModel).
			//interval: 'PT15M', // interval MUST BE defined for ROLLUP API
			//cache_expiration_in_seconds:60,
			//timerange: { begin:{value:1,unit:'days'},end:{value:0,unit:'days'}},
			access:'PRIVATE'
		});
		UCO2M.subscribe(this); // Now we will receive notifications from the UserModel.
		this.master.modelRepo.add('UserCO2Model',UCO2M);
		this.models['UserCO2Model'] = UCO2M;
		
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserHeatingView(this);
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
		this.timers['UserHeatingView'] = {timer:undefined, interval:interval, models:['UserTemperatureModel','UserHumidityModel','UserCO2Model']};
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		//this.show(); // Try if this view can be shown right now!
	}
}
