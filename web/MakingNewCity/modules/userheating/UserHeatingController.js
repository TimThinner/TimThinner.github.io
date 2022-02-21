import Controller from '../common/Controller.js';
import UserApartmentModel from '../userpage/UserApartmentModel.js';
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
	
	init() {
		const mTR = {ends:{value:10,unit:'seconds'},starts:{value:30,unit:'days'}};
		// Response is 24 x 60 x 7 values  = 10 080 measurements => 24 x 7 averages (168 averages).
		//             24 x 60 x 30 values = 43 200 measurements => 24 x 30 averages (720 averages).
		const model_HeatingMonth = new UserApartmentModel({
			name:'UserHeatingMonthModel',
			src:'data/sivakka/apartments/feeds.json',
			type:'sensor',
			limit:0,
			range:mTR,
			timerange: 30  // NOTE: This is always 30 days here! TEST: 3 days! 4320 values!
		});
		model_HeatingMonth.subscribe(this);
		this.master.modelRepo.add('UserHeatingMonthModel',model_HeatingMonth);
		this.models['UserHeatingMonthModel'] = model_HeatingMonth;
		
		const model_Feedback = new FeedbackModel({name:'FeedbackModel',src:''});
		model_Feedback.subscribe(this);
		this.master.modelRepo.add('FeedbackModel',model_Feedback);
		this.models['FeedbackModel'] = model_Feedback;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserHeatingView(this);
	}
}
