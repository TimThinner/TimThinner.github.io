import Controller from '../common/Controller.js';
import VegeView from './VegeView.js';

export default class VegeController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		// Every Controller MUST have MenuModel in its models.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new VegeView(this);
	}
}
