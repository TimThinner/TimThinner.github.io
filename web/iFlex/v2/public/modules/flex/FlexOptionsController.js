import Controller from '../common/Controller.js';
import FlexOptionsView from './FlexOptionsView.js';
export default class FlexOptionsController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove(); // unsubscribe all this.models and remove view.
		// We must remove all models that were created here at the initialize-method.
		// and then reset models-object.
		this.models = {};
	}
	
	
	setNewTimerange(days) {
		const m = this.master.modelRepo.get('FlexResultModel');
		m.numberOfDays = days;
		// and set the one in MenuController also!
		this.master.setNumberOfDays(days);
	}
	
	init() {
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		// Create a view for Apartment feedback.
		this.view = new FlexOptionsView(this);
	}
}
