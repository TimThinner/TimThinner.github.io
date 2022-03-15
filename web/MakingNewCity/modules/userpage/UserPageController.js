import Controller from '../common/Controller.js';
import UserHeatingModel from '../userheating/UserHeatingModel.js';
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
		this.numOfDays = 2;
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the init():
		Object.keys(this.models).forEach(key => {
			if (key==='UserHeatingNowModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		
		// We must remove all models that were created here at the init-method.
		for (let i=0; i<this.numOfDays; i++) {
			const key = 'UserElectricityNow'+i+'Model';
			console.log(['remove ',key,' from the REPO']);
			this.master.modelRepo.remove(key);
		}
		
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
		
		// NOTE: Range is created dynamically at each fetching cycle.
		const model_data = [];
		for (let i=0; i<this.numOfDays; i++) {
			model_data.push({name:'UserElectricityNow'+i+'Model',index:i});
		}
		model_data.forEach(md => {
			const m = new UserElectricityModel({
				name: md.name,
				src: 'data/sivakka/apartments/feeds.json',
				type: 'energy',
				limit: 1,
				index: md.index
			});
			m.subscribe(this);
			this.master.modelRepo.add(md.name, m);
			this.models[md.name] = m;
		});
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserPageView(this);
	}
}
