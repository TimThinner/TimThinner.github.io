import Controller from '../common/Controller.js';
//import UserPageModel from './UserPageModel.js';
import UserPageView from './UserPageView.js';

export default class UserPageController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the init():
		/*
		Object.keys(this.models).forEach(key => {
			if (key==='UserPageModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		*/
		this.models = {};
	}
	
	clean() {
		this.remove();
		this.init();
	}
	
	init() {
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		this.view = new UserPageView(this);
	}
}
