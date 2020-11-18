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
			if (key==='UserHeatingWeekModel'||key==='FeedbackModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	initialize() {
		
		const weekTR = {ends:{value:10,unit:'seconds'},starts:{value:7,unit:'days'}};
		// Response is 24 x 60 x 7 values = 10080 measurements => 24 x 7 averages (168 averages).
		const model_HeatingWeek = new UserApartmentModel({
			name:'UserHeatingWeekModel',
			src:'data/sivakka/apartments/feeds.json',
			type:'sensor',
			limit:0,
			range:weekTR,
			timerange: 7  // NOTE: This is always 7 days here!
		});
		model_HeatingWeek.subscribe(this);
		this.master.modelRepo.add('UserHeatingWeekModel',model_HeatingWeek);
		this.models['UserHeatingWeekModel'] = model_HeatingWeek;
		
		const model_Feedback = new FeedbackModel({name:'FeedbackModel',src:''});
		model_Feedback.subscribe(this);
		this.master.modelRepo.add('FeedbackModel',model_Feedback);
		this.models['FeedbackModel'] = model_Feedback;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserHeatingView(this);
	}
	
	clean() {
		console.log('UserHeatingController is now REALLY cleaned!');
		this.remove();
		this.initialize();
	}
	
	init() {
		this.initialize();
		this.timers['UserHeatingView'] = {timer: undefined, interval: 60000, models:['UserHeatingWeekModel','FeedbackModel']};
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
