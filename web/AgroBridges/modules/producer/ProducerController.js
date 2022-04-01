import Controller from '../common/Controller.js';
import ProducerView from './ProducerView.js';

export default class ProducerController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		// Every Controller MUST have MenuModel in its models.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new ProducerView(this);
	}
}
