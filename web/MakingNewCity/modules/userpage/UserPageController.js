import Controller from '../common/Controller.js';

import UserHeatingModel from '../userheating/UserHeatingModel.js';
// NOTE: To simulate apartment heating measurements, we use UserApartmentModel. 
//import UserApartmentModel from './UserApartmentModel.js';

import UserElectricityModel from '../userelectricity/UserElectricityModel.js';
import UserPageView from './UserPageView.js';
/*

New way to get temperature and humidity data:

https://makingcity.vtt.fi/data/sivakka/wlsensordata/last.json?pointId=11534143

Returns:
{"tMeterId":11534143,"hMeterId":11534144,"created_at":"2022-03-09 12:36:16","timestamp":"2022-03-09 12:33:47","temperature":0,"humidity":1267503.8}

*/
export default class UserPageController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the init():
		Object.keys(this.models).forEach(key => {
			if (key==='UserHeatingNowModel' || key==='UserElectricityNowModel' || key==='UserElectricity0Model') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	clean() {
		this.remove();
		this.init();
	}
	
	init() {
		const m = new UserHeatingModel({
			name: 'UserHeatingNowModel',
			src: 'data/sivakka/wlsensordata/last.json'
		});
		m.subscribe(this);
		this.master.modelRepo.add('UserHeatingNowModel',m);
		this.models['UserHeatingNowModel'] = m;
		
		const m2 = new UserElectricityModel({
			name: 'UserElectricityNowModel',
			src: 'data/sivakka/house_energy_data/last.json',
			limit: 1,
			index: 0
		});
		m2.subscribe(this);
		this.master.modelRepo.add('UserElectricityNowModel', m2);
		this.models['UserElectricityNowModel'] = m2;
		
		const m3 = new UserElectricityModel({
			name: 'UserElectricity0Model',
			src: 'data/sivakka/house_energy_data/feeds.json',
			limit: 0,
			index: 0
		});
		m3.subscribe(this);
		this.master.modelRepo.add('UserElectricity0Model', m3);
		this.models['UserElectricity0Model'] = m3;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserPageView(this);
	}
}
