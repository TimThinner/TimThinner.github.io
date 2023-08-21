import Controller from '../common/Controller.js';
import HelpModel from './HelpModel.js';
import HelpView from './HelpView.js';

export default class HelpController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the initialize-method.
		Object.keys(this.models).forEach(key => {
			if (key==='HelpModel') {
				console.log(['remove ',key,' from the REPO']);
				this.master.modelRepo.remove(key);
			}
		});
		this.models = {};
	}
	
	initialize() {
		
		const model = new HelpModel({name:'HelpModel',src:''});
		model.subscribe(this);
		this.master.modelRepo.add('HelpModel',model);
		this.models['HelpModel'] = model;
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.view = new HelpView(this);
	}
	
	init() {
		this.initialize();
	}
}
