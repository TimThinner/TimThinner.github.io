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
	
	init() {
		// These two lines MUST BE in every Controller.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.models['FlexResultModel'] = this.master.modelRepo.get('FlexResultModel');
		this.models['FlexResultModel'].subscribe(this);
		
		// Create a view for Apartment feedback.
		this.view = new FlexOptionsView(this);
	}
}
