import Controller from '../../common/Controller.js';
import UserApartmentModel from '../../userpage/UserApartmentModel.js';
import UserApartmentTimeSeriesModel from '../../userpage/UserApartmentTimeSeriesModel.js';
import UWCWrapperView from './UWCWrapperView.js';

export default class UserWaterChartsController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='UserWaterALLModel'||key==='UserWaterTSModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	refreshTimerange() {
		const timerName = 'UserWaterChartsView';
		this.restartPollingInterval(timerName);
	}
	
	
	show() {
		console.log('IN UserWaterChartsController show() FIRST reset the MODEL.');
		this.models['UserWaterTSModel'].reset();
		
		console.log('THEN CALL SUPER show().');
		super.show(); // To pass this (options.model==='MenuModel' && options.method==='selected')
	}
	
	
	notify(options) {
		super.notify(options); // To pass this (options.model==='MenuModel' && options.method==='selected')
		if (options.model==='UserWaterTSModel' && options.method==='fetched') {
			if (options.status === 200) {
				//console.log(['CONTROLLER Notify: ',options.model,' fetched!']);
				//console.log('CALL AGAIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
				this.poller('UserWaterTSView'); // Param is the name of the TIMER!
			}
		}
	}
	
	initialize() {
		const allTR = {ends:{value:10,unit:'seconds'},starts:{value:1,unit:'days'}};
		
		const model = new UserApartmentModel({name:'UserWaterALLModel',src:'data/sivakka/apartments/feeds.json',type:'water',limit:0,range:allTR});
		model.subscribe(this);
		this.master.modelRepo.add('UserWaterALLModel',model);
		this.models['UserWaterALLModel'] = model;
		
		const m = new UserApartmentTimeSeriesModel({name:'UserWaterTSModel',src:'data/sivakka/apartments/feeds.json',type:'water',limit:1,rounds:31}); // rounds 31 => 30 days
		m.subscribe(this);
		this.master.modelRepo.add('UserWaterTSModel',m);
		this.models['UserWaterTSModel'] = m;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UWCWrapperView(this);
	}
	
	clean() {
		console.log('UserWaterChartsController is now REALLY cleaned!');
		this.remove();
		this.initialize();
	}
	
	init() {
		this.initialize();
		this.timers['UserWaterChartsView'] = {timer: undefined, interval: 60000, models:['UserWaterALLModel']};
		this.timers['UserWaterTSView'] = {timer: undefined, interval: -1, models:['UserWaterTSModel']};
		//this.show(); // Try if this view can be shown right now!
	}
}
