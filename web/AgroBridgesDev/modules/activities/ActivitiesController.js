import Controller from '../common/Controller.js';
import ActivitiesView from './ActivitiesView.js';

export default class ActivitiesController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		// Every Controller MUST have MenuModel in its models.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new ActivitiesView(this);
	}
}
