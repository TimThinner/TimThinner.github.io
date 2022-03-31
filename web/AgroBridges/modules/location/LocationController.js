import Controller from '../common/Controller.js';
import LocationView from './LocationView.js';

export default class LocationController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		// Every Controller MUST have MenuModel in its models.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new LocationView(this);
	}
}
