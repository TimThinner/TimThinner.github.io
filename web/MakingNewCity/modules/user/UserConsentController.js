import Controller from '../common/Controller.js';
import UserConsentModel from './UserConsentModel.js';
import UserConsentView from './UserConsentView.js';

export default class UserConsentController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		/* super.remove() in Controller.js:
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		*/
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='UserConsentModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	initialize() {
		const model = new UserConsentModel({name:'UserConsentModel',src:''});
		model.subscribe(this);
		this.master.modelRepo.add('UserConsentModel',model);
		this.models['UserConsentModel'] = model;
		
		this.models['UserModel'] = this.master.modelRepo.get('UserModel');
		this.models['UserModel'].subscribe(this);
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserConsentView(this);
	}
	
	clean() {
		this.remove();
		this.initialize();
	}
	
	init() {
		this.initialize();
	}
}
