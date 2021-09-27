import Controller from '../common/Controller.js';
import UserGDPRModel from './UserGDPRModel.js';
import UserGDPRView from './UserGDPRView.js';

export default class UserGDPRController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='UserGDPRModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	initialize() {
		
		const model = new UserGDPRModel({name:'UserGDPRModel',src:''});
		model.subscribe(this);
		this.master.modelRepo.add('UserGDPRModel',model);
		this.models['UserGDPRModel'] = model;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new UserGDPRView(this);
	}
	
	init() {
		this.initialize();
	}
}
