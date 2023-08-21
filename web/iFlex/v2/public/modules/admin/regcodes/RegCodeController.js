import Controller from '../../common/Controller.js';
import RegCodeModel from  './RegCodeModel.js';
import RegCodeView from './RegCodeView.js';

export default class RegCodeController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the init():
		// Currently this app does NOT remove Controllers. 
		// They are all created at the load and stay that way, so init() is called ONLY once.
		// BUT this is not how dynamic system should optimally behave.
		// So I just add model removal here, to enable this in the future.
		
		Object.keys(this.models).forEach(key => {
			if (key === 'RegCodeModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
				
			}
		});
		this.models = {};
	}
	
	clean() {
		console.log('RegCodeController is now REALLY cleaned!');
		this.remove();
		/* IN Controller:
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		*/
		this.init();
	}
	
	init() {
		// Fetch only once!
		const model = new RegCodeModel({name:'RegCodeModel',src:'to-be-added-in-the-future'});
		model.subscribe(this);
		this.master.modelRepo.add('RegCodeModel',model);
		this.models['RegCodeModel'] = model;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new RegCodeView(this);
	}
}
