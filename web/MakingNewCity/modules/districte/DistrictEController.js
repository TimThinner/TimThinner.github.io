import Controller from '../common/Controller.js';
//import StatusModel from  './StatusModel.js';
//import { StatusJetitek983Model, StatusJetitek1012Model } from  './StatusJetitekModels.js';

import DistrictEView from './DistrictEView.js';

export default class DistrictEController extends Controller {
	
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
		/*
		const m1 = new StatusModel({name:'StatusModel',src:'data/arina/iss/status'});
		m1.subscribe(this);
		this.master.modelRepo.add('StatusModel',m1);
		this.models['StatusModel'] = m1;
		
		const m2 = new StatusJetitek983Model({name:'StatusJetitek983Model',src:'data/arina/jetitek/feeds.json?pointId=983'});
		m2.subscribe(this);
		this.master.modelRepo.add('StatusJetitek983Model',m2);
		this.models['StatusJetitek983Model'] = m2;
		
		const m3 = new StatusJetitek1012Model({name:'StatusJetitek1012Model',src:'data/arina/jetitek/feeds.json?pointId=1012'});
		m3.subscribe(this);
		this.master.modelRepo.add('StatusJetitek1012Model',m3);
		this.models['StatusJetitek1012Model'] = m3;
		*/
		
		//this.timers['DistrictCView'] = {timer: undefined, interval: 30000, models:['StatusModel','StatusJetitek983Model','StatusJetitek1012Model']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictEView(this);
	}
}
