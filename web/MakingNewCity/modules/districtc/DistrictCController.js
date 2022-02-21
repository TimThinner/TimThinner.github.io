import Controller from '../common/Controller.js';
//import StatusModel from  './StatusModel.js';
//import { StatusJetitek983Model, StatusJetitek1012Model } from  './StatusJetitekModels.js';

import DistrictCView from './DistrictCView.js';

export default class DistrictCController extends Controller {
	
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
		Object.keys(this.models).forEach(key => {
			//if (key === 'StatusModel'||key==='StatusJetitek983Model'||key==='StatusJetitek1012Model') {
			//	this.master.modelRepo.remove(key);
			//}
		});
	}
	
	init() {
		
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictCView(this);
	}
}
