import Controller from '../common/Controller.js';
import DView from './DView.js';
/*
	FeedbackModel is created at MasterController (not here), because it is needed in:
		1. DController 
		2. UserFeedbackController
	Both handle the same User Feedback, only difference is that in DController anonymous feedback is possible.
*/
export default class DController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove(); // unsubscribe all this.models and remove view.
		// We must remove all models that were created here at the initialize-method.
		// and then reset models-object.
		this.models = {};
	}
	
	init() {
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		// Create a view for Building feedback.
		this.view = new DView(this);
	}
}
