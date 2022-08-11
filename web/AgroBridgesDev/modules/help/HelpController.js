import Controller from '../common/Controller.js';
import HelpView from './HelpView.js';

export default class HelpController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		// Every Controller MUST have MenuModel in its models.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new HelpView(this);
	}
}
