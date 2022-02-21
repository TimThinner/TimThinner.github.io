import Controller from '../common/Controller.js';
import UserChangePswView from './UserChangePswView.js';

export default class UserChangePswController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		this.models = {};
	}
	
	clean() {
		this.remove();
		this.init();
	}
	
	init() {
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		this.view = new UserChangePswView(this);
	}
}
