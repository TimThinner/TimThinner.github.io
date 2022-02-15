import Controller from '../common/Controller.js';
import EnvironmentPageView from './EnvironmentPageView.js';

import EmpoModel from './EmpoModel.js';

/*

NOTE:
New REST-API interface:

https://app.swaggerhub.com/apis/jean-nicolas.louis/emission-and_power_grid_status/1.0.0

The one that we need to retrieve is:
http://128.214.253.150/api/v1/resources/emissions/latest?country=Finland&EmDB=EcoInvent 

RESPONSE EXAMPLE:

{ "results": [ { "country": "FI", "date_time": "2021-11-16 10:31:06", "em_cons": 160.305, "em_prod": 148.0854, "emdb": "EcoInvent", "id": 159293 } ] }

*/

export default class EnvironmentPageController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the init():
		// Currently this app does NOT remove Controllers. 
		// They are all created at the load and stay that way, so init() is called ONLY once.
		// BUT this is not how dynamic system should optimally behave.
		// So I just add model removal here, to enable this in the future.
		/*
		Object.keys(this.models).forEach(key => {
			if (key === 'EmpoEmissionsModel') {
				this.master.modelRepo.remove(key);
			}
		});
		*/
	}
	
	init() {
		// Get all models where name starts with 'EmpoEmissions', they were already created at MenuController.
		const model_names = this.master.modelRepo.keys();
		model_names.forEach(name => {
			if (name.indexOf('EmpoEmissions') === 0) {
				this.models[name] = this.master.modelRepo.get(name);
			}
		});
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		this.view = new EnvironmentPageView(this);
	}
}
