import Controller from '../common/Controller.js';
import UserGDPRView from './UserGDPRView.js';

export default class UserGDPRController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		this.models = {};
	}
	
	init() {
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		this.view = new UserGDPRView(this);
	}
}
