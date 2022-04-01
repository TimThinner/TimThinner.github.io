import Controller from '../common/Controller.js';
import InfoView from './InfoView.js';

export default class InfoController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	init() {
		// Every Controller MUST have MenuModel in its models.
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new InfoView(this);
	}
}
