import Controller from '../common/Controller.js';
import UserHeatingLastModel from './UserHeatingLastModel.js';
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
			if (key==='UserHeatingLastModel') {
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
		
		// Response is 24 x 60 x 30 values = 43 200 measurements => 24 x 30 averages (720 averages).
		const m = new UserHeatingLastModel({
			name: 'UserHeatingLastModel',
			src: 'data/sivakka/wlsensordata/last.json'
		});
		m.subscribe(this);
		this.master.modelRepo.add('UserHeatingLastModel',m);
		this.models['UserHeatingLastModel'] = m;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserPageView(this);
	}
}
