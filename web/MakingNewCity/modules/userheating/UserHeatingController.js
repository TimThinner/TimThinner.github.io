import Controller from '../common/Controller.js';
import UserHeatingModel from './UserHeatingModel.js';
import FeedbackModel from '../common/FeedbackModel.js';
import UserHeatingView from './UserHeatingView.js';

export default class UserHeatingController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove(); // NOTE: Controller super.remove() unsubscribes all this.models
		Object.keys(this.models).forEach(key => {
			if (key==='UserHeatingMonthModel'||key==='FeedbackModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	clean() {
		console.log('UserHeatingController is now REALLY cleaned!');
		this.remove();
		this.init();
	}
	/*
	We fetch values for last 30 days => 
	Calculate averages for last 30 days, last 7 days and finally last 24 hours.
	
	
	
	resolution 1 hour 720 values (30 x 24 = 720)
	
	
	
	https://makingcity.vtt.fi/data/sivakka/wlsensordata/feeds.json?pointId=11534143&start=2021-12-26&end=2021-12-31&limit=10
	
	*/
	init() {
		// Response is 24 x 60 x 30 values = 43 200 measurements => 24 x 30 averages (720 averages).
		const model_Heating = new UserHeatingModel({
			name: 'UserHeatingMonthModel',
			src: 'data/sivakka/apartments/feeds.json',
			type: 'sensor', // // type = sensor (Temperature and Humidity)
			limit: 0, // 0 = no limit
			timerange: 30 // 30 days
		});
		model_Heating.subscribe(this);
		this.master.modelRepo.add('UserHeatingMonthModel',model_Heating);
		this.models['UserHeatingMonthModel'] = model_Heating;
		
		const model_Feedback = new FeedbackModel({name:'FeedbackModel',src:''});
		model_Feedback.subscribe(this);
		this.master.modelRepo.add('FeedbackModel',model_Feedback);
		this.models['FeedbackModel'] = model_Feedback;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserHeatingView(this);
	}
}
