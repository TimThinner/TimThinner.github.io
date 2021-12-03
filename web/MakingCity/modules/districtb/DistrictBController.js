import Controller from '../common/Controller.js';
import SivakkaStatusModel from  './SivakkaStatusModel.js';
//import { StatusJetitek983Model, StatusJetitek1012Model } from  './StatusJetitekModels.js';

import DistrictBView from './DistrictBView.js';
/*

https://makingcity.vtt.fi/data/sivakka/gstdata/last.json?pointid=
https://makingcity.vtt.fi/data/sivakka/gstdata/status


1.2		11099378	Exthaus air recovery
1.3		
1.4		11793375	DHN hot
1.5		11099156	DHN Cool
1.6		
1.7		
1.8		
1.9		11050758	Heating Devices

In Configuration.js:
this.backend = 'https://makingcity.vtt.fi';

In FeedModel the URL is completed:

const url = this.mongoBackend + '/feeds/';
const body_url = this.backend + '/' + this.src + '&start='+start_date+'&end='+end_date;
const data = {url:body_url};

const myPost = {
	method: 'POST',
	headers: myHeaders,
	body: JSON.stringify(data)
};
const myRequest = new Request(this.mongoBackend + '/feeds/', myPost);
...

WHEN we get latest measurement values for ALL points we can use:
const body_url = this.backend + '/data/sivakka/gstdata/status'

*/
export default class DistrictBController extends Controller {
	
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
			if (key === 'SivakkaStatusModel') {
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	init() {
		// https://makingcity.vtt.fi/data/sivakka/gstdata/status
		const m = new SivakkaStatusModel({name:'SivakkaStatusModel',src:'data/sivakka/gstdata/status'});
		m.subscribe(this);
		this.master.modelRepo.add('SivakkaStatusModel',m);
		this.models['SivakkaStatusModel'] = m;
		
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
		
		this.timers['DistrictBView'] = {timer: undefined, interval: 30000, models:['SivakkaStatusModel']};
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new DistrictBView(this);
		//this.show();
	}
}
